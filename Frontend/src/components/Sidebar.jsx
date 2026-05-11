import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const Sidebar = ({ refreshTrigger }) => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const { chatId } = useParams();

  const [chats, setChats] = useState([]);
  const [usage, setUsage] = useState({ total: 0, max: 20 });
  const [editingId, setEditingId] = useState(null);   // chat currently being renamed
  const [editTitle, setEditTitle] = useState('');
  const [limitError, setLimitError] = useState('');
  const editInputRef = useRef(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/chats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(data.chats);
        setUsage(data.usage);
      } catch (err) {
        console.error('Failed to fetch chats:', err.message);
      }
    };
    fetchChats();
  }, [token, refreshTrigger]);

  // Focus input when rename mode activates
  useEffect(() => {
    if (editingId) editInputRef.current?.focus();
  }, [editingId]);

  const handleNewChat = async () => {
    setLimitError('');
    try {
      const { data } = await axios.post(
        'http://localhost:3000/api/chats',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/chat/${data._id}`);
    } catch (err) {
      if (err.response?.data?.limitReached) {
        setLimitError(err.response.data.message);
        setTimeout(() => setLimitError(''), 5000);
      }
    }
  };

  const handleDeleteChat = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:3000/api/chats/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats((prev) => prev.filter((c) => c._id !== id));
      setUsage((u) => ({ ...u, total: u.total - 1 }));
      if (chatId === id) navigate('/chat');
    } catch (err) {
      console.error('Failed to delete chat:', err.message);
    }
  };

  const startRename = (e, chat) => {
    e.stopPropagation();
    setEditingId(chat._id);
    setEditTitle(chat.title);
  };

  const submitRename = async (id) => {
    if (!editTitle.trim() || editTitle.trim() === chats.find((c) => c._id === id)?.title) {
      setEditingId(null);
      return;
    }
    try {
      const { data } = await axios.patch(
        `http://localhost:3000/api/chats/${id}/title`,
        { title: editTitle.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChats((prev) => prev.map((c) => (c._id === id ? { ...c, title: data.title } : c)));
    } catch (err) {
      console.error('Failed to rename chat:', err.message);
    }
    setEditingId(null);
  };

  const handleRenameKeyDown = (e, id) => {
    if (e.key === 'Enter') submitRename(id);
    if (e.key === 'Escape') setEditingId(null);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const usagePercent = Math.min((usage.total / usage.max) * 100, 100);
  const usageColor = usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 70 ? 'bg-amber-500' : 'bg-cyan-500';

  return (
    <aside className="w-64 min-w-64 bg-[#0d1117] border-r border-[#1e2535] flex flex-col h-screen">

      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-[#1e2535]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-500/30 flex-shrink-0">
            P
          </div>
          <span className="text-white font-bold text-base tracking-tight">Perplexity</span>
        </div>

        <button
          onClick={handleNewChat}
          disabled={usage.total >= usage.max}
          className="w-full flex items-center justify-center gap-2 bg-[#161b27] hover:bg-[#1e2535] disabled:opacity-40 disabled:cursor-not-allowed border border-[#2a3245] hover:border-[#3a4255] text-slate-300 hover:text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all duration-200 group"
        >
          <svg className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>

        {/* Chat limit error toast */}
        {limitError && (
          <div className="mt-2 bg-red-950/60 border border-red-500/20 text-red-400 text-[11px] px-3 py-2 rounded-lg leading-snug">
            {limitError}
          </div>
        )}

        {/* Chat usage bar */}
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-slate-600">Chats used</span>
            <span className={`text-[10px] font-semibold ${usagePercent >= 90 ? 'text-red-400' : 'text-slate-500'}`}>
              {usage.total} / {usage.max}
            </span>
          </div>
          <div className="h-1 bg-[#1e2535] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${usageColor}`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {chats.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="w-10 h-10 bg-[#1e2535] rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-slate-600 text-xs">No chats yet</p>
            <p className="text-slate-700 text-xs mt-1">Start a new conversation</p>
          </div>
        ) : (
          <>
            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold px-2 mb-2">Recent</p>
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => !editingId && navigate(`/chat/${chat._id}`)}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 mb-0.5 ${
                  chatId === chat._id
                    ? 'bg-[#1e2535] border border-[#2a3245] text-white'
                    : 'text-slate-400 hover:bg-[#161b27] hover:text-slate-200'
                }`}
              >
                <svg className={`w-3.5 h-3.5 flex-shrink-0 ${chatId === chat._id ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>

                {/* Inline rename input */}
                {editingId === chat._id ? (
                  <input
                    ref={editInputRef}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => submitRename(chat._id)}
                    onKeyDown={(e) => handleRenameKeyDown(e, chat._id)}
                    onClick={(e) => e.stopPropagation()}
                    maxLength={80}
                    className="flex-1 bg-[#0d1117] border border-cyan-500/40 text-slate-200 text-xs px-2 py-0.5 rounded-lg outline-none"
                  />
                ) : (
                  <span className="flex-1 text-xs truncate">{chat.title}</span>
                )}

                {/* Action buttons — shown on hover */}
                {editingId !== chat._id && (
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                    {/* Rename button */}
                    <button
                      onClick={(e) => startRename(e, chat)}
                      className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-blue-500/15 hover:text-blue-400 text-slate-600 transition-all"
                      title="Rename"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDeleteChat(e, chat._id)}
                      className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-red-500/15 hover:text-red-400 text-slate-600 transition-all"
                      title="Delete"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[#1e2535] space-y-2">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-200 text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-slate-600 text-[10px] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/8 text-xs font-medium transition-all duration-150"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;