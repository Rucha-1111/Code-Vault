import React from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/collections', label: 'Collections', icon: '📁' },
  { to: '/explore', label: 'Explore', icon: '🧭' },
  { to: '/saved', label: 'Saved', icon: '💜' },
]

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-2 z-40">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) =>
            `flex flex-col items-center text-[11px] px-3 py-1 rounded-lg ${
              isActive ? 'text-brand-600' : 'text-gray-400'
            }`
          }
        >
          <span className="text-lg">{l.icon}</span>
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
}
