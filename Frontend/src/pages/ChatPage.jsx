import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import MessageBubble from '../components/MessageBubble.jsx';
import SourceCards from '../components/SourceCards.jsx';

const socket = io('http://localhost:3000', { autoConnect: false });

const SUGGESTIONS = [
  { icon: '🌍', text: 'What are the latest AI breakthroughs in 2025?' },
  { icon: '💡', text: 'Explain quantum computing in simple terms' },
  { icon: '📈', text: 'How does the stock market actually work?' },
  { icon: '🚀', text: 'What is SpaceX Starship mission?' },
];

const ChatPage = () => {
  const { chatId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarRefresh, setSidebarRefresh] = useState(0);
  const [rateLimitToast, setRateLimitToast] = useState('');
  const [msgRemaining, setMsgRemaining] = useState(null);
  const [currentSources, setCurrentSources] = useState([]);  // sources for the in-progress response

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (!chatId) { setMessages([]); return; }
    const load = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/chats/${chatId}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(data);
      } catch (err) {
        console.error('Failed to load messages:', err.message);
      }
    };
    load();
  }, [chatId, token]);

  useEffect(() => {
    const onAiResponse = ({ delta }) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return [...prev.slice(0, -1), { ...last, content: last.content + delta }];
        }
        return [...prev, { role: 'assistant', content: delta, _id: 'streaming' }];
      });
    };
    const onAiDone = () => {
      setIsLoading(false);
      setCurrentSources([]);
      setSidebarRefresh((n) => n + 1);
    };
    const onAiStopped = () => {
      setIsLoading(false);
      setCurrentSources([]);
    };
    const onSources = ({ sources }) => setCurrentSources(sources);
    const onError = ({ message }) => {
      setIsLoading(false);
      setCurrentSources([]);
      setMessages((prev) => [...prev, { role: 'assistant', content: `❌ ${message}`, _id: 'error' }]);
    };
    const onRateLimited = ({ message }) => {
      setIsLoading(false);
      setRateLimitToast(message);
      setTimeout(() => setRateLimitToast(''), 6000);
    };
    const onRateLimitInfo = ({ remaining }) => setMsgRemaining(remaining);

    socket.on('aiResponse', onAiResponse);
    socket.on('aiDone', onAiDone);
    socket.on('aiStopped', onAiStopped);
    socket.on('sources', onSources);
    socket.on('error', onError);
    socket.on('rateLimited', onRateLimited);
    socket.on('rateLimitInfo', onRateLimitInfo);
    return () => {
      socket.off('aiResponse', onAiResponse);
      socket.off('aiDone', onAiDone);
      socket.off('aiStopped', onAiStopped);
      socket.off('sources', onSources);
      socket.off('error', onError);
      socket.off('rateLimited', onRateLimited);
      socket.off('rateLimitInfo', onRateLimitInfo);
    };
  }, []);

  const handleSend = useCallback(async (text) => {
    const trimmed = (text || question).trim();
    if (!trimmed || isLoading) return;

    let activeChatId = chatId;
    if (!activeChatId) {
      try {
        const { data } = await axios.post('http://localhost:3000/api/chats', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        activeChatId = data._id;
        navigate(`/chat/${activeChatId}`, { replace: true });
      } catch (err) {
        console.error('Failed to create chat:', err.message);
        return;
      }
    }

    setMessages((prev) => [...prev, { role: 'user', content: trimmed, _id: Date.now().toString() }]);
    setQuestion('');
    setCurrentSources([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);
    socket.emit('sendMessage', { chatId: activeChatId, question: trimmed, token });
  }, [question, isLoading, chatId, token, navigate]);

  const handleStop = () => {
    socket.emit('stopGeneration');
    setIsLoading(false);
    setCurrentSources([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleTextareaChange = (e) => {
    setQuestion(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`;
  };

  const isEmpty = messages.length === 0;
  const isLowMessages = msgRemaining !== null && msgRemaining <= 3;

  return (
    <div className="flex h-screen bg-[#0d1117] overflow-hidden">
      <Sidebar refreshTrigger={sidebarRefresh} />

      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Rate limit toast */}
        {rateLimitToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-amber-950/90 border border-amber-500/30 text-amber-300 text-sm px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-sm max-w-md">
            <svg className="w-4 h-4 flex-shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
            </svg>
            {rateLimitToast}
          </div>
        )}

        {/* Low message warning bar */}
        {isLowMessages && !rateLimitToast && (
          <div className="bg-amber-950/40 border-b border-amber-500/15 px-5 py-2 flex items-center justify-between">
            <span className="text-amber-400/80 text-xs">
              ⚠ Only <strong>{msgRemaining}</strong> message{msgRemaining !== 1 ? 's' : ''} left this hour
            </span>
          </div>
        )}

        {isEmpty ? (
          /* ── Empty / Home state ── */
          <div className="flex-1 flex flex-col items-center justify-center px-6 pb-4">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
            <div className="relative text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-3xl mx-auto mb-5 shadow-2xl shadow-blue-500/30">
                P
              </div>
              <h1 className="text-white text-3xl font-bold mb-2">What do you want to know?</h1>
              <p className="text-slate-500 text-sm">Ask anything — I search the web and answer in real-time</p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-xl mb-8">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.text}
                  onClick={() => handleSend(s.text)}
                  className="flex items-start gap-3 bg-[#161b27] hover:bg-[#1e2535] border border-[#1e2535] hover:border-[#2a3245] rounded-xl p-3.5 text-left transition-all duration-150 group"
                >
                  <span className="text-lg flex-shrink-0">{s.icon}</span>
                  <span className="text-slate-400 group-hover:text-slate-300 text-xs leading-snug">{s.text}</span>
                </button>
              ))}
            </div>

            <InputBox
              question={question}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              onSend={() => handleSend()}
              isLoading={isLoading}
              textareaRef={textareaRef}
            />
          </div>
        ) : (
          /* ── Chat with messages ── */
          <>
            <div className="flex-1 overflow-y-auto py-6">
              <div className="max-w-3xl mx-auto">
                {messages.map((msg, i) => (
                  <MessageBubble key={msg._id || i} role={msg.role} content={msg.content} />
                ))}

                {/* Source cards appear while streaming (before AI text starts) */}
                {isLoading && currentSources.length > 0 && (
                  <SourceCards sources={currentSources} />
                )}

                {/* Thinking dots — only before first AI token */}
                {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                  <div className="flex gap-3 px-6 py-4">
                    <div className="w-8 h-8 rounded-full bg-[#1e2535] border border-[#2a3245] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="bg-[#161b27] border border-[#1e2535] rounded-2xl rounded-tl-sm px-5 py-4">
                      <div className="flex gap-1.5 items-center">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-[#1e2535] bg-[#0d1117] px-6 py-4">
              <div className="max-w-3xl mx-auto">
                {/* Stop generation button — floats above input while AI is streaming */}
                {isLoading && (
                  <div className="flex justify-center mb-3">
                    <button
                      onClick={handleStop}
                      className="flex items-center gap-2 bg-[#1e2535] hover:bg-[#2a3245] border border-[#2a3245] hover:border-red-500/30 text-slate-400 hover:text-red-400 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 group"
                    >
                      <span className="w-2 h-2 bg-red-400 rounded-sm group-hover:bg-red-400 animate-pulse" />
                      Stop generating
                    </button>
                  </div>
                )}
                <InputBox
                  question={question}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  onSend={() => handleSend()}
                  isLoading={isLoading}
                  textareaRef={textareaRef}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

/* ── Input Box Component ── */
const InputBox = ({ question, onChange, onKeyDown, onSend, isLoading, textareaRef }) => (
  <div className="w-full max-w-2xl mx-auto">
    <div className={`flex flex-col bg-[#111827] border rounded-3xl px-5 pt-4 pb-3 transition-all duration-300 ${
      isLoading
        ? 'border-[#1e2535]'
        : 'border-[#1e2d45] focus-within:border-cyan-500/30 focus-within:shadow-xl focus-within:shadow-cyan-500/5'
    }`}>
      {/* Textarea — starts 1 line, grows as you type */}
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder="Ask anything..."
        value={question}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={isLoading}
        className="w-full bg-transparent outline-none text-slate-200 placeholder-slate-500 text-[15px] leading-relaxed resize-none disabled:opacity-40 pb-2"
        style={{ minHeight: '28px', maxHeight: '300px', overflowY: 'auto' }}
      />

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-2 border-t border-[#1e2535]">
        <span className="text-[11px] text-slate-600 select-none">
          {isLoading ? (
            <span className="flex items-center gap-1.5 text-cyan-600/80">
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Searching &amp; generating...
            </span>
          ) : (
            'Enter to send · Shift+Enter for new line'
          )}
        </span>

        <button
          onClick={onSend}
          disabled={isLoading || !question.trim()}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
            !isLoading && question.trim()
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-blue-500/25 hover:scale-105'
              : 'bg-[#1e2535] text-slate-600 cursor-not-allowed'
          }`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
          </svg>
          Send
        </button>
      </div>
    </div>
  </div>
);

export default ChatPage;