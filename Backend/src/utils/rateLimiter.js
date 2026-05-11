// In-memory rate limiter — tracks message sends per user
// Key: userId string, Value: { count, windowStart }
const messageWindows = new Map();

const MAX_MESSAGES_PER_WINDOW = 15;   // max messages a user can send
const WINDOW_MS = 60 * 60 * 1000;    // per 1 hour
const MAX_CHATS_PER_USER = 20;        // max total chats allowed

export const checkMessageRateLimit = (userId) => {
  const now = Date.now();
  const entry = messageWindows.get(userId);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    // New window — reset counter
    messageWindows.set(userId, { count: 1, windowStart: now });
    return { allowed: true, remaining: MAX_MESSAGES_PER_WINDOW - 1 };
  }

  if (entry.count >= MAX_MESSAGES_PER_WINDOW) {
    const resetIn = Math.ceil((WINDOW_MS - (now - entry.windowStart)) / 60000);
    return { allowed: false, resetIn }; // resetIn = minutes until window resets
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_MESSAGES_PER_WINDOW - entry.count };
};

export { MAX_CHATS_PER_USER, MAX_MESSAGES_PER_WINDOW, WINDOW_MS };