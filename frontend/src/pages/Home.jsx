import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchCollections, fetchRecentlySaved } from '../api/collections'
import SearchBar from '../components/SearchBar'
import CollectionCard from '../components/CollectionCard'
import SavedItemRow from '../components/SavedItemRow'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [collections, setCollections] = useState([])
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchCollections(), fetchRecentlySaved()])
      .then(([c, r]) => {
        setCollections(c)
        setRecent(r)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (query, type) => {
    navigate(`/explore?q=${encodeURIComponent(query)}&type=${type}`)
  }

  const totalItems = collections.reduce((sum, c) => sum + c.itemCount, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-hero-gradient px-6 sm:px-10 py-10 sm:py-12">
        <HeroDecor />
        <div className="relative z-10 max-w-xl">
          <h1 className="font-display font-bold text-white text-2xl sm:text-3xl leading-snug">
            Discover GitHub.
            <br />
            Collect What <span className="text-coral-400">Inspires</span> You.
          </h1>
          <p className="text-white/70 text-sm mt-2 mb-5">
            Search users or repositories and save them into your collections.
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main column */}
        <div className="flex flex-col gap-6 min-w-0">
          <Section title="📁 Quick Collections" linkTo="/collections">
            {loading ? (
              <SkeletonGrid />
            ) : collections.length === 0 ? (
              <EmptyHint text="No collections yet. Create one from the Collections tab or when you save an item!" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {collections.slice(0, 4).map((c, i) => (
                  <CollectionCard key={c.id} collection={c} index={i} />
                ))}
              </div>
            )}
          </Section>

          <Section title="🕒 Recently Saved" linkTo="/saved">
            {loading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : recent.length === 0 ? (
              <EmptyHint text="Nothing saved yet. Head to Explore and start collecting!" />
            ) : (
              <div className="bg-white rounded-2xl shadow-card px-2 divide-y divide-gray-50">
                {recent.slice(0, 5).map((item) => (
                  <SavedItemRow key={item.id} item={item} showCollection />
                ))}
              </div>
            )}
          </Section>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-5 relative overflow-hidden">
            <p className="font-display font-semibold text-gray-800 text-[15px]">👋 Welcome back!</p>
            <p className="text-[13px] text-gray-500 mt-1">Ready to discover something awesome today, {user?.username}?</p>
            <div className="text-6xl mt-3 text-center float-slow">🐙💻</div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-5">
            <p className="font-display font-semibold text-gray-800 text-[15px] mb-3">📊 Your Stats</p>
            <StatRow label="Collections" value={collections.length} />
            <StatRow label="Saved items" value={totalItems} />
          </div>

          <Link
            to="/explore"
            className="btn-primary text-white text-center font-semibold py-3 rounded-2xl shadow-card"
          >
            🔭 Start Exploring
          </Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, linkTo, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-gray-800 text-[15px]">{title}</h2>
        <Link to={linkTo} className="text-brand-600 text-[13px] font-medium">
          View all →
        </Link>
      </div>
      {children}
    </div>
  )
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-[13.5px] text-gray-500">{label}</span>
      <span className="text-[14px] font-semibold text-gray-800">{value}</span>
    </div>
  )
}

function EmptyHint({ text }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6 text-center text-sm text-gray-400">{text}</div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
      ))}
    </div>
  )
}

function HeroDecor() {
  const stars = Array.from({ length: 18 })
  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map((_, i) => (
        <span
          key={i}
          className="twinkle absolute text-white"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 90}%`,
            fontSize: `${5 + Math.random() * 7}px`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        >
          ✦
        </span>
      ))}
      <div className="absolute right-4 sm:right-10 -top-2 text-6xl sm:text-8xl float-slow">🚀</div>
      <div className="absolute right-24 bottom-4 text-4xl float-slow opacity-70" style={{ animationDelay: '.7s' }}>
        🪐
      </div>
    </div>
  )
}
