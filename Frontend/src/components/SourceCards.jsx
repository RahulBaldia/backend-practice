import { useState } from 'react';

const SourceCards = ({ sources }) => {
  const [expanded, setExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  const visible = expanded ? sources : sources.slice(0, 3);

  return (
    <div className="px-6 pt-2 pb-1">
      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" />
          </svg>
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest">Sources</span>
          <span className="text-[10px] text-slate-700 bg-[#1e2535] px-1.5 py-0.5 rounded-full">{sources.length}</span>
        </div>

        {/* Cards grid */}
        <div className="flex flex-wrap gap-2 mb-2">
          {visible.map((src) => (
            <a
              key={src.index}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 bg-[#161b27] hover:bg-[#1e2535] border border-[#1e2535] hover:border-[#2a3245] rounded-xl px-3 py-2 transition-all duration-150 max-w-[220px]"
            >
              {/* Favicon */}
              <img
                src={src.favicon}
                alt=""
                width={14}
                height={14}
                className="rounded-sm flex-shrink-0 opacity-80 group-hover:opacity-100"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="min-w-0">
                {/* Citation number */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-cyan-500/70 bg-cyan-500/10 px-1 py-0.5 rounded">
                    [{src.index}]
                  </span>
                  <span className="text-slate-300 text-[11px] font-medium truncate group-hover:text-white transition-colors">
                    {src.title?.slice(0, 28)}{src.title?.length > 28 ? '…' : ''}
                  </span>
                </div>
                {/* Domain */}
                <p className="text-slate-600 text-[10px] mt-0.5 truncate group-hover:text-slate-500 transition-colors">
                  {new URL(src.url).hostname.replace('www.', '')}
                </p>
              </div>
              {/* External link icon */}
              <svg className="w-3 h-3 text-slate-700 group-hover:text-slate-500 flex-shrink-0 ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}

          {/* Show more / less toggle */}
          {sources.length > 3 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1.5 bg-[#161b27] hover:bg-[#1e2535] border border-[#1e2535] rounded-xl px-3 py-2 text-slate-500 hover:text-slate-300 text-[11px] transition-all"
            >
              {expanded ? (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                  Show less
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  +{sources.length - 3} more
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SourceCards;