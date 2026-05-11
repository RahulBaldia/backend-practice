import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const CopyButton = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea');
      el.value = content;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy response"
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 ${
        copied
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
          : 'bg-[#1e2535] hover:bg-[#2a3245] text-slate-500 hover:text-slate-300 border border-transparent hover:border-[#2a3245]'
      }`}
    >
      {copied ? (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
};

const MessageBubble = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 px-6 py-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
        isUser
          ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-md shadow-blue-500/30'
          : 'bg-[#1e2535] border border-[#2a3245] text-cyan-400'
      }`}>
        {isUser ? 'U' : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Bubble + copy button */}
      <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-[#1e3a5f] border border-blue-800/40 text-slate-200 rounded-tr-sm text-sm leading-relaxed'
            : 'bg-[#161b27] border border-[#1e2535] text-slate-300 rounded-tl-sm'
        }`}>
          {isUser ? (
            <p className="text-sm leading-relaxed">{content}</p>
          ) : (
            <div className="prose-custom text-sm leading-relaxed">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Copy button — only for AI messages */}
        {!isUser && content && (
          <CopyButton content={content} />
        )}
      </div>
    </div>
  );
};

export default MessageBubble;