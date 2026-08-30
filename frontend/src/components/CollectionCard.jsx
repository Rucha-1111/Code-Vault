import React from 'react'
import { Link } from 'react-router-dom'

const BG_CLASSES = [
  'bg-pink-50',
  'bg-blue-50',
  'bg-green-50',
  'bg-yellow-50',
  'bg-purple-50',
  'bg-orange-50',
]

export default function CollectionCard({ collection, index = 0 }) {
  return (
    <Link
      to={`/collections/${collection.id}`}
      className={`card-pop rounded-2xl p-4 flex flex-col gap-3 ${BG_CLASSES[index % BG_CLASSES.length]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{collection.icon}</span>
        <span className="text-gray-300">⋯</span>
      </div>
      <div>
        <p className="font-semibold text-[14.5px] text-gray-800 truncate">{collection.name}</p>
        <p className="text-[12px] text-gray-500">🔖 {collection.itemCount} items</p>
      </div>
    </Link>
  )
}
