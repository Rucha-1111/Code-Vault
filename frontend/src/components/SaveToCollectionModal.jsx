import React, { useEffect, useState } from 'react'
import { fetchCollections, createCollection, addItemToCollection } from '../api/collections'
import { useToast } from '../context/ToastContext'

const EMOJIS = ['📁', '⭐', '💡', '🚀', '🎯', '🔥', '🧠', '🎨']

export default function SaveToCollectionModal({ item, onClose }) {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [savingId, setSavingId] = useState(null)
  const { showToast } = useToast()

  useEffect(() => {
    fetchCollections()
      .then(setCollections)
      .catch(() => showToast('Could not load collections', 'error'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = async (collectionId) => {
    setSavingId(collectionId)
    try {
      await addItemToCollection(collectionId, item)
      showToast('Saved to collection! ✨')
      onClose()
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not save item', 'error')
    } finally {
      setSavingId(null)
    }
  }

  const handleCreateAndSave = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      const icon = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
      const collection = await createCollection(newName.trim(), icon)
      await handleSave(collection.id)
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not create collection', 'error')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-sm shadow-popup overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-3 border-b border-gray-100">
          <p className="font-display font-semibold text-gray-900">Save to a collection</p>
          <p className="text-sm text-gray-400 truncate">{item.title}</p>
        </div>

        <div className="max-h-64 overflow-y-auto px-3 py-2">
          {loading && <p className="text-sm text-gray-400 px-2 py-4">Loading your collections...</p>}
          {!loading && collections.length === 0 && (
            <p className="text-sm text-gray-400 px-2 py-4">No collections yet — create your first one below 👇</p>
          )}
          {collections.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSave(c.id)}
              disabled={savingId === c.id}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 transition-colors text-left"
            >
              <span className="text-xl">{c.icon}</span>
              <span className="flex-1 text-sm font-medium text-gray-700">{c.name}</span>
              <span className="text-xs text-gray-400">{c.itemCount} items</span>
              {savingId === c.id && <span className="text-xs text-brand-500">saving…</span>}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          {!creating ? (
            <button
              onClick={() => setCreating(true)}
              className="w-full text-sm font-medium text-brand-600 py-2 rounded-lg hover:bg-brand-50"
            >
              + Create new collection
            </button>
          ) : (
            <form onSubmit={handleCreateAndSave} className="flex gap-2">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Collection name"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
              <button type="submit" className="btn-primary text-white text-sm px-3 rounded-lg font-medium">
                Save
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
