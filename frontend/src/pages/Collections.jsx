import React, { useEffect, useState } from 'react'
import { fetchCollections, createCollection, deleteCollection, renameCollection } from '../api/collections'
import { useToast } from '../context/ToastContext'
import { Link } from 'react-router-dom'

const EMOJIS = ['📁', '⭐', '💡', '🚀', '🎯', '🔥', '🧠', '🎨', '📚', '🌟']

export default function Collections() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const { showToast } = useToast()

  const load = () => {
    setLoading(true)
    fetchCollections()
      .then(setCollections)
      .catch(() => showToast('Could not load collections', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    try {
      const icon = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
      const created = await createCollection(name.trim(), icon)
      setCollections((c) => [created, ...c])
      setName('')
      setShowCreate(false)
      showToast('Collection created! 🎉')
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not create collection', 'error')
    }
  }

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete "${c.name}"? This removes all its saved items too.`)) return
    try {
      await deleteCollection(c.id)
      setCollections((prev) => prev.filter((x) => x.id !== c.id))
      showToast('Collection deleted')
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not delete collection', 'error')
    }
  }

  const startRename = (c) => {
    setRenamingId(c.id)
    setRenameValue(c.name)
  }

  const submitRename = async (e, c) => {
    e.preventDefault()
    if (!renameValue.trim()) return
    try {
      const updated = await renameCollection(c.id, renameValue.trim(), c.icon)
      setCollections((prev) => prev.map((x) => (x.id === c.id ? updated : x)))
      setRenamingId(null)
      showToast('Collection renamed')
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not rename collection', 'error')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-gray-900">📁 Your Collections</h1>
          <p className="text-sm text-gray-500 mt-1">Organize saved profiles and repos into folders that make sense to you.</p>
        </div>
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="btn-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-card whitespace-nowrap"
        >
          + New Collection
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="flex gap-2 bg-white rounded-2xl shadow-card p-4">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Java Developers, Amazing Repos..."
            className="flex-1 auth-input"
          />
          <button type="submit" className="btn-primary text-white px-4 rounded-xl font-medium text-sm">
            Create
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : collections.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center text-gray-400">
          No collections yet. Create your first one above! 🌱
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl shadow-card p-4 card-pop flex flex-col gap-3">
              {renamingId === c.id ? (
                <form onSubmit={(e) => submitRename(e, c)} className="flex gap-2">
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    className="flex-1 auth-input"
                  />
                  <button className="text-brand-600 font-medium text-sm">Save</button>
                  <button type="button" onClick={() => setRenamingId(null)} className="text-gray-400 text-sm">
                    ✕
                  </button>
                </form>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{c.icon}</span>
                    <div className="flex gap-2">
                      <button onClick={() => startRename(c)} title="Rename" className="text-gray-400 hover:text-brand-600">
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(c)} title="Delete" className="text-gray-400 hover:text-coral-500">
                        🗑️
                      </button>
                    </div>
                  </div>
                  <Link to={`/collections/${c.id}`}>
                    <p className="font-semibold text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">🔖 {c.itemCount} items</p>
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
