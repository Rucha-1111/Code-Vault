import React, { useState } from 'react'

const FILTERS = [
  { key: 'all', label: 'All', icon: '🔀' },
  { key: 'users', label: 'Users', icon: '👤' },
  { key: 'repositories', label: 'Repositories', icon: '📦' },
]

export default function SearchBar({ onSearch, initialQuery = '', initialType = 'all', large = false }) {
  const [query, setQuery] = useState(initialQuery)
  const [type, setType] = useState(initialType)

  const submit = (e) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim(), type)
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className={`flex flex-col sm:flex-row gap-2 ${large ? '' : ''}`}>
        <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3 shadow-card">
          <span className="text-gray-400 mr-2">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search GitHub users or repositories..."
            className="flex-1 outline-none text-[14.5px] text-gray-700 placeholder:text-gray-400 bg-transparent"
          />
        </div>
        <button
          type="submit"
          className="btn-primary text-white font-medium px-6 py-3 rounded-xl text-[14.5px] shadow-card whitespace-nowrap"
        >
          Search
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        {FILTERS.map((f) => (
          <button
            type="button"
            key={f.key}
            onClick={() => setType(f.key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              type === f.key
                ? 'bg-brand-600 text-white'
                : 'bg-white/70 text-gray-600 hover:bg-white'
            }`}
          >
            <span>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>
    </form>
  )
}
