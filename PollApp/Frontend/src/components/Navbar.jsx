import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const linkClass = (path) =>
    `text-sm font-medium px-4 py-2 rounded-xl transition-colors ${
      pathname === path
        ? 'bg-violet-50 text-violet-600'
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
    }`

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-xl">🗳️</span>
          <span className="text-gray-900 font-bold text-lg tracking-tight">PollSnap</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          <Link to="/" className={linkClass('/')}>
            + Create Poll
          </Link>
          <Link to="/polls" className={linkClass('/polls')}>
            All Polls
          </Link>
        </div>

      </div>
    </nav>
  )
}
