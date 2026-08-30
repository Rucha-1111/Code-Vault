import React from 'react'

export default function SavedItemRow({ item, onRemove, showCollection = false }) {
  const isUser = item.itemType === 'USER'

  return (
    <div className="flex items-center gap-3 py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors">
      <img
        src={item.avatarUrl || 'https://avatars.githubusercontent.com/u/0?v=4'}
        alt={item.title}
        className={`w-10 h-10 object-cover bg-gray-100 ${isUser ? 'rounded-full' : 'rounded-lg'}`}
      />
      <div className="flex-1 min-w-0">
        <a
          href={item.htmlUrl}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[14px] text-gray-800 hover:text-brand-600 truncate block"
        >
          {item.title}
        </a>
        <p className="text-[12.5px] text-gray-400 truncate">{item.subtitle || 'No description'}</p>
      </div>
      <span
        className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
          isUser ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
        }`}
      >
        {isUser ? 'User' : 'Repository'}
      </span>
      {showCollection && item.collectionName && (
        <span className="hidden sm:inline text-[11px] text-gray-400 whitespace-nowrap">📁 {item.collectionName}</span>
      )}
      <span className="hidden sm:inline text-[11px] text-gray-300 whitespace-nowrap">{timeAgo(item.savedAt)}</span>
      {onRemove && (
        <button
          onClick={() => onRemove(item)}
          title="Remove"
          className="text-gray-300 hover:text-coral-500 transition-colors"
        >
          🗑️
        </button>
      )}
    </div>
  )
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
