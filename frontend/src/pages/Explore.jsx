import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import ResultCard from '../components/ResultCard'
import { searchGithub } from '../api/github'
import { useToast } from '../context/ToastContext'

export default function Explore() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const type = params.get('type') || 'all'

  const [results, setResults] = useState({ users: [], repositories: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { showToast } = useToast()

  const runSearch = useCallback(
    async (q, t) => {
      setLoading(true)
      setError('')
      try {
        const data = await searchGithub(q, t)
        if (t === 'users') {
          setResults({ users: data.items || [], repositories: [] })
        } else if (t === 'repositories') {
          setResults({ users: [], repositories: data.items || [] })
        } else {
          setResults({
            users: data.users?.items || [],
            repositories: data.repositories?.items || [],
          })
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Search failed. Please try again.'
        setError(message)
        showToast(message, 'error')
      } finally {
        setLoading(false)
      }
    },
    [showToast]
  )

  useEffect(() => {
    if (query) runSearch(query, type)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (q, t) => {
    setParams({ q, type: t })
    runSearch(q, t)
  }

  const hasResults = results.users.length > 0 || results.repositories.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl bg-hero-gradient px-6 sm:px-10 py-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="font-display font-bold text-white text-xl sm:text-2xl mb-1">🧭 Explore GitHub</h1>
          <p className="text-white/70 text-sm mb-5">Find profiles and repositories worth keeping.</p>
          <SearchBar onSearch={handleSearch} initialQuery={query} initialType={type} />
        </div>
      </div>

      {loading && <p className="text-center text-gray-400 py-10">Searching GitHub... 🔎</p>}

      {!loading && error && <p className="text-center text-coral-500 py-10">{error}</p>}

      {!loading && !error && query && !hasResults && (
        <p className="text-center text-gray-400 py-10">No results for "{query}". Try another search!</p>
      )}

      {!loading && !error && !query && (
        <p className="text-center text-gray-400 py-16">
          Search for GitHub users or repositories above to get started ✨
        </p>
      )}

      {!loading && results.users.length > 0 && (
        <ResultSection title="👤 Users">
          {results.users.map((u) => (
            <ResultCard key={u.id} type="USER" data={u} />
          ))}
        </ResultSection>
      )}

      {!loading && results.repositories.length > 0 && (
        <ResultSection title="📦 Repositories">
          {results.repositories.map((r) => (
            <ResultCard key={r.id} type="REPOSITORY" data={r} />
          ))}
        </ResultSection>
      )}
    </div>
  )
}

function ResultSection({ title, children }) {
  return (
    <div>
      <h2 className="font-display font-semibold text-gray-800 text-[15px] mb-3">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
    </div>
  )
}
