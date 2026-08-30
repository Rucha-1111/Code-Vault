import React, { useEffect, useState } from 'react'
import { fetchCollections, fetchCollectionItems, removeItemFromCollection } from '../api/collections'
import { useToast } from '../context/ToastContext'
import SavedItemRow from '../components/SavedItemRow'

export default function SavedItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const { showToast } = useToast()

  const load = async () => {
    setLoading(true)
    try {
      const collections = await fetchCollections()
      const all = await Promise.all(
        collections.map((c) => fetchCollectionItems(c.id).then((items) => items.map((i) => ({ ...i, __collectionId: c.id }))))
      )
      const flat = all.flat().sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
      setItems(flat)
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not load saved items', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRemove = async (item) => {
    if (!window.confirm(`Remove "${item.title}" from ${item.collectionName}?`)) return
    try {
      await removeItemFromCollection(item.__collectionId, item.id)
      setItems((prev) => prev.filter((i) => i.id !== item.id || i.__collectionId !== item.__collectionId))
      showToast('Item removed')
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not remove item', 'error')
    }
  }

  const filtered = items.filter((i) => filter === 'ALL' || i.itemType === filter)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display font-bold text-xl text-gray-900">💜 All Saved Items</h1>
        <p className="text-sm text-gray-500 mt-1">Everything you've saved, across every collection.</p>
      </div>

      <div className="flex gap-2">
        {[
          { key: 'ALL', label: 'All' },
          { key: 'USER', label: '👤 Users' },
          { key: 'REPOSITORY', label: '📦 Repositories' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium ${
              filter === f.key ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 shadow-card'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center text-gray-400">Nothing here yet.</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card px-3 divide-y divide-gray-50">
          {filtered.map((item) => (
            <SavedItemRow key={`${item.__collectionId}-${item.id}`} item={item} onRemove={handleRemove} showCollection />
          ))}
        </div>
      )}
    </div>
  )
}
