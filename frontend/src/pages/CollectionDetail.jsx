import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchCollections, fetchCollectionItems, removeItemFromCollection, renameCollection, deleteCollection } from '../api/collections'
import { useToast } from '../context/ToastContext'
import SavedItemRow from '../components/SavedItemRow'

export default function CollectionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [collection, setCollection] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const [collections, collectionItems] = await Promise.all([fetchCollections(), fetchCollectionItems(id)])
      const found = collections.find((c) => String(c.id) === String(id))
      if (!found) {
        showToast('Collection not found', 'error')
        navigate('/collections')
        return
      }
      setCollection(found)
      setItems(collectionItems)
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not load collection', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleRemove = async (item) => {
    if (!window.confirm(`Remove "${item.title}" from this collection?`)) return
    try {
      await removeItemFromCollection(id, item.id)
      setItems((prev) => prev.filter((i) => i.id !== item.id))
      showToast('Item removed')
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not remove item', 'error')
    }
  }

  const submitRename = async (e) => {
    e.preventDefault()
    if (!renameValue.trim()) return
    try {
      const updated = await renameCollection(id, renameValue.trim(), collection.icon)
      setCollection(updated)
      setRenaming(false)
      showToast('Collection renamed')
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not rename collection', 'error')
    }
  }

  const handleDeleteCollection = async () => {
    if (!window.confirm(`Delete "${collection.name}"? This removes all its saved items too.`)) return
    try {
      await deleteCollection(id)
      showToast('Collection deleted')
      navigate('/collections')
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not delete collection', 'error')
    }
  }

  if (loading) return <p className="text-gray-400 text-sm">Loading...</p>
  if (!collection) return null

  return (
    <div className="flex flex-col gap-6">
      <Link to="/collections" className="text-sm text-brand-600 font-medium w-fit">
        ← Back to Collections
      </Link>

      <div className="bg-white rounded-2xl shadow-card p-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{collection.icon}</span>
          <div>
            {renaming ? (
              <form onSubmit={submitRename} className="flex gap-2">
                <input
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  className="auth-input"
                />
                <button className="text-brand-600 font-medium text-sm">Save</button>
                <button type="button" onClick={() => setRenaming(false)} className="text-gray-400 text-sm">
                  ✕
                </button>
              </form>
            ) : (
              <>
                <h1 className="font-display font-bold text-xl text-gray-900">{collection.name}</h1>
                <p className="text-sm text-gray-400">🔖 {items.length} saved items</p>
              </>
            )}
          </div>
        </div>
        {!renaming && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setRenaming(true)
                setRenameValue(collection.name)
              }}
              className="px-3 py-2 rounded-xl text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
            >
              ✏️ Rename
            </button>
            <button
              onClick={handleDeleteCollection}
              className="px-3 py-2 rounded-xl text-sm font-medium bg-red-50 text-coral-600 hover:bg-red-100"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center text-gray-400">
          This collection is empty. <Link to="/explore" className="text-brand-600 font-medium">Explore GitHub</Link> to add something!
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card px-3 divide-y divide-gray-50">
          {items.map((item) => (
            <SavedItemRow key={item.id} item={item} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  )
}
