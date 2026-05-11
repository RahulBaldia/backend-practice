import jwt from 'jsonwebtoken';
import Groq from 'groq-sdk';
import { tavily } from '@tavily/core';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import { checkMessageRateLimit, MAX_CHATS_PER_USER } from '../utils/rateLimiter.js';

let _groq, _tavily;
const getGroq = () => (_groq ??= new Groq({ apiKey: process.env.GROQ_API_KEY }));
const getTavily = () => (_tavily ??= tavily({ apiKey: process.env.TAVILY_API_KEY }));

// Tracks active AbortControllers per socket — key: socketId, value: AbortController
const activeStreams = new Map();

// ─── HTTP CRUD ────────────────────────────────────────────────────────────────

export const createChat = async (req, res) => {
  try {
    const chatCount = await Chat.countDocuments({ userId: req.user._id });
    if (chatCount >= MAX_CHATS_PER_USER) {
      return res.status(429).json({
        message: `You have reached the maximum limit of ${MAX_CHATS_PER_USER} chats. Please delete some chats to create new ones.`,
        limitReached: true,
      });
    }
    const chat = await Chat.create({ userId: req.user._id, title: 'New Chat' });
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ chats, usage: { total: chats.length, max: MAX_CHATS_PER_USER } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    await Message.deleteMany({ chatId: chat._id });
    await chat.deleteOne();
    res.json({ message: 'Chat deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateChatTitle = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ message: 'Title is required' });
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title: title.trim().slice(0, 80) },
      { new: true }
    );
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    const messages = await Message.find({ chatId: req.params.id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── STOP GENERATION ─────────────────────────────────────────────────────────

export const handleStopGeneration = (socket) => {
  const controller = activeStreams.get(socket.id);
  if (controller) {
    controller.abort();
    activeStreams.delete(socket.id);
    socket.emit('aiStopped'); // tell frontend streaming was cancelled
  }
};

// ─── SOCKET.IO AI HANDLER ─────────────────────────────────────────────────────

export const handleSocketMessage = async (io, socket, data) => {
  const { chatId, question, token } = data;

  // 1. Verify JWT
  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch {
    socket.emit('error', { message: 'Unauthorized' });
    return;
  }

  // 2. Check message rate limit
  const rateCheck = checkMessageRateLimit(userId.toString());
  if (!rateCheck.allowed) {
    socket.emit('rateLimited', {
      message: `You've reached the message limit. Please wait ${rateCheck.resetIn} minute${rateCheck.resetIn > 1 ? 's' : ''} before sending again.`,
      resetIn: rateCheck.resetIn,
    });
    return;
  }

  try {
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) { socket.emit('error', { message: 'Chat not found' }); return; }

    if (!question || question.trim().length === 0) {
      socket.emit('error', { message: 'Message cannot be empty' }); return;
    }
    if (question.length > 10000) {
      socket.emit('error', { message: 'Message is too long. Please keep it under 10,000 characters.' }); return;
    }

    await Message.create({ chatId, role: 'user', content: question.trim() });

    if (chat.title === 'New Chat') {
      chat.title = question.trim().slice(0, 60);
      await chat.save();
    }

    // Casual vs research detection
    const casualPatterns = /^(hi|hello|hey|thanks|thank you|thankyou|thx|ty|ok|okay|cool|great|nice|bye|goodbye|yes|no|sure|got it|understood|lol|haha|sup|wassup|yo)\W*$/i;
    const isCasual = casualPatterns.test(question.trim()) || (question.trim().split(' ').length <= 2 && question.trim().length < 20);

    // Web search
    let searchContext = '';
    let sources = [];
    if (!isCasual) {
      try {
        const searchResult = await getTavily().search(question, { maxResults: 5, searchDepth: 'basic' });
        sources = searchResult.results.map((r, i) => ({
          index: i + 1,
          title: r.title,
          url: r.url,
          snippet: r.content?.slice(0, 160) + '...',
          favicon: `https://www.google.com/s2/favicons?domain=${new URL(r.url).hostname}&sz=32`,
        }));
        searchContext = sources
          .map((s) => `[${s.index}] ${s.title}\n${s.snippet}\nSource: ${s.url}`)
          .join('\n\n');

        // Send sources to frontend BEFORE streaming starts so cards appear immediately
        socket.emit('sources', { sources });
      } catch (searchErr) {
        console.error('Tavily search failed:', searchErr.message);
      }
    }

    const systemPrompt = isCasual
      ? `You are a friendly AI assistant. Respond naturally and conversationally. Keep your reply short and warm.`
      : `You are a helpful AI research assistant. Use the web search results below to give accurate, up-to-date answers.\n\n${
          searchContext
            ? `Web Search Results:\n${searchContext}\n\nInstructions:\n- Use search results to answer accurately\n- Format in clean markdown\n- Cite sources as [1], [2], etc.\n- Be concise and clear`
            : `Instructions:\n- Answer using your knowledge\n- Format in clean markdown\n- Be concise and clear`
        }`;

    socket.emit('rateLimitInfo', { remaining: rateCheck.remaining });

    // Create an AbortController for this stream — stored by socketId so stopGeneration can cancel it
    const controller = new AbortController();
    activeStreams.set(socket.id, controller);

    let fullResponse = '';
    let wasStopped = false;

    try {
      const stream = await getGroq().chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
        stream: true,
        max_tokens: 1024,
      }, { signal: controller.signal }); // pass abort signal to Groq

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || '';
        if (delta) {
          fullResponse += delta;
          socket.emit('aiResponse', { delta });
        }
      }
    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) {
        wasStopped = true; // user stopped — not an actual error
      } else {
        throw err; // real error — rethrow to outer catch
      }
    } finally {
      activeStreams.delete(socket.id);
    }

    // Save whatever was generated before stop (if anything)
    if (fullResponse.trim()) {
      const savedContent = wasStopped ? fullResponse + '\n\n*(Generation stopped)*' : fullResponse;
      await Message.create({ chatId, role: 'assistant', content: savedContent });
    }

    if (!wasStopped) {
      socket.emit('aiDone', { chatId });
    }

    await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });
  } catch (err) {
    console.error('Socket handler error:', err.message);
    socket.emit('error', { message: 'Something went wrong. Please try again.' });
  }
};