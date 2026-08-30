import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/collections', label: 'Collections', icon: '📁' },
  { to: '/explore', label: 'Explore', icon: '🧭' },
  { to: '/saved', label: 'Saved Items', icon: '💜' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-100 px-5 py-6">
      <div className="flex items-center gap-2 mb-8 px-1">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-white text-lg">
          🐙
        </div>
        <div className="leading-tight">
          <p className="font-display font-bold text-[15px] text-gray-900">GitHub</p>
          <p className="font-display font-bold text-[15px] text-brand-600 -mt-1">Collections</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14.5px] font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <span className="text-[17px]">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-white border border-brand-100 p-4 mb-4 relative overflow-hidden">
          <p className="text-[13px] text-gray-500 leading-snug">
            Organize. Save. Explore.
            <br />
            All things GitHub! 🐾
          </p>
          <div className="text-4xl mt-2 float-slow inline-block">🐈‍⬛</div>
        </div>

        <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
          <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-lg">
            {user?.avatarEmoji || '🐙'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.username}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="text-gray-400 hover:text-coral-500 transition-colors text-lg"
          >
            ⎋
          </button>
        </div>
      </div>
    </aside>
  )
}
