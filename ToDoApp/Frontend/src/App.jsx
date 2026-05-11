import { useState, useMemo, useEffect } from "react";

// ── Date formatter ────────────────────────────────────────────────
const fmt = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// ── Base API URL — change this if your backend port changes ───────
const BASE = "http://localhost:3000/api/todos";

// ════════════════════════════════════════════════════════════════════
//  Main App
// ════════════════════════════════════════════════════════════════════
export default function App() {

  // ── State ─────────────────────────────────────────────────────
  const [todos,     setTodos]     = useState([]);
  const [title,     setTitle]     = useState("");
  const [desc,      setDesc]      = useState("");
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("all");    // all | completed | pending
  const [sort,      setSort]      = useState("newest"); // newest | oldest
  const [editId,    setEditId]    = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc,  setEditDesc]  = useState("");
  const [loading,   setLoading]   = useState(false);

  // ── GET all todos ──────────────────────────────────────────────
  const getTodos = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/getTodos`);
      const data = await res.json();
      setTodos(data.todos); // backend returns { message, todos }
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  // ── ADD todo ───────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!title.trim()) return;
    try {
      await fetch(`${BASE}/createTodo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: desc.trim(),
        }),
      });
      setTitle("");
      setDesc("");
      getTodos();
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  };

  // ── TOGGLE complete ────────────────────────────────────────────
  const toggleComplete = async (id, completed) => {
    try {
      await fetch(`${BASE}/updateTodo/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      getTodos();
    } catch (err) {
      console.error("Failed to toggle todo:", err);
    }
  };

  // ── DELETE todo ────────────────────────────────────────────────
  const deleteTodo = async (id) => {
    try {
      await fetch(`${BASE}/deleteTodo/${id}`, { method: "DELETE" });
      getTodos();
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  // ── START edit ─────────────────────────────────────────────────
  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
    setEditDesc(todo.description);
  };

  // ── SAVE edit ──────────────────────────────────────────────────
  const saveEdit = async () => {
    if (!editTitle.trim()) return;
    try {
      await fetch(`${BASE}/updateTodo/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDesc.trim(),
        }),
      });
      setEditId(null);
      getTodos();
    } catch (err) {
      console.error("Failed to update todo:", err);
    }
  };

  // ── Derived list (search + filter + sort) ─────────────────────
  const visible = useMemo(() => {
    let list = todos.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );
    if (filter === "completed") list = list.filter((t) =>  t.completed);
    if (filter === "pending")   list = list.filter((t) => !t.completed);
    list = [...list].sort((a, b) =>
      sort === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
    return list;
  }, [todos, search, filter, sort]);

  // ── Counts for filter badges ───────────────────────────────────
  const counts = {
    all:       todos.length,
    completed: todos.filter((t) =>  t.completed).length,
    pending:   todos.filter((t) => !t.completed).length,
  };

  // ════════════════════════════════════════════════════════════════
  //  Render
  // ════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── Top Bar ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806
                   3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806
                   3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946
                   3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946
                   3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806
                   3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806
                   3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946
                   3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946
                   3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Todo App</h1>
          <span className="ml-auto text-sm text-slate-400">
            {counts.pending} task{counts.pending !== 1 ? "s" : ""} remaining
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* ── Add Todo Card ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Add New Todo
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Todo title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50
                         text-slate-800 placeholder-slate-400 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <textarea
              placeholder="Description (optional)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50
                         text-slate-800 placeholder-slate-400 text-sm resize-none
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <button
              onClick={handleAdd}
              disabled={!title.trim()}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700
                         disabled:bg-blue-300 disabled:cursor-not-allowed
                         text-white text-sm font-semibold transition active:scale-95"
            >
              + Add Todo
            </button>
          </div>
        </section>

        {/* ── Search + Sort ── */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white
                         text-slate-800 placeholder-slate-400 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white
                       text-slate-600 text-sm focus:outline-none focus:ring-2
                       focus:ring-blue-500 transition cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex gap-2">
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition
                ${filter === f
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full
                ${filter === f ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* ── Todo List ── */}
        <section className="space-y-3">

          {/* Loading state */}
          {loading && (
            <div className="text-center py-10 text-slate-400">
              <svg className="w-6 h-6 mx-auto mb-2 animate-spin" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm">Loading todos…</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && visible.length === 0 && (
            <div className="text-center py-14 text-slate-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                     M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm font-medium">No todos found</p>
              <p className="text-xs mt-1 text-slate-300">Try adjusting your search or filter</p>
            </div>
          )}

          {/* Todo cards */}
          {!loading && visible.map((todo) => (
            <div
              key={todo._id}
              className={`bg-white rounded-2xl border shadow-sm p-4 transition-all
                ${todo.completed ? "border-slate-100 opacity-70" : "border-slate-200"}`}
            >

              {/* ── EDIT MODE ── */}
              {editId === todo._id ? (
                <div className="space-y-2">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-blue-300 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-blue-300 text-sm
                               resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={saveEdit}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white
                                 text-xs font-semibold rounded-lg transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600
                                 text-xs font-semibold rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

              ) : (
                /* ── VIEW MODE ── */
                <div className="flex items-start gap-3">

                  {/* Circular checkbox */}
                  <button
                    onClick={() => toggleComplete(todo._id, todo.completed)}
                    title={todo.completed ? "Mark as pending" : "Mark as complete"}
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0
                                flex items-center justify-center transition
                      ${todo.completed
                        ? "bg-blue-600 border-blue-600"
                        : "border-slate-300 hover:border-blue-400"}`}
                  >
                    {todo.completed && (
                      <svg className="w-3 h-3 text-white" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold text-slate-800 leading-snug
                      ${todo.completed ? "line-through text-slate-400" : ""}`}>
                      {todo.title}
                    </p>
                    {todo.description && (
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                        {todo.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${todo.completed
                          ? "bg-green-50 text-green-600"
                          : "bg-amber-50 text-amber-600"}`}>
                        {todo.completed ? "Completed" : "Pending"}
                      </span>
                      <span className="text-xs text-slate-300">•</span>
                      <span className="text-xs text-slate-400">{fmt(todo.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-1 flex-shrink-0">
                    {/* Edit */}
                    <button
                      onClick={() => startEdit(todo)}
                      title="Edit"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600
                                 hover:bg-blue-50 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                             m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      title="Delete"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500
                                 hover:bg-red-50 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858
                             L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                </div>
              )}
            </div>
          ))}
        </section>

        {/* ── Footer summary ── */}
        {todos.length > 0 && (
          <p className="text-center text-xs text-slate-300 pb-4">
            {counts.completed} of {counts.all} tasks completed
          </p>
        )}

      </main>
    </div>
  );
}