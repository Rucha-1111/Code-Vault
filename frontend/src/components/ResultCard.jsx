import React, { useState } from 'react'
import SaveToCollectionModal from './SaveToCollectionModal'

// A unified card for both GitHub users and repositories
export default function ResultCard({ type, data }) {
  const [showSave, setShowSave] = useState(false)

  const isUser = type === 'USER'

  const item = isUser
    ? {
        itemType: 'USER',
        title: data.login,
        subtitle: data.bio || 'GitHub member',
        avatarUrl: data.avatar_url,
        htmlUrl: data.html_url,
        meta: data.followers != null ? `👥 ${data.followers} followers` : '',
      }
    : {
        itemType: 'REPOSITORY',
        title: data.full_name,
        subtitle: data.description || 'No description provided',
        avatarUrl: data.owner?.avatar_url,
        htmlUrl: data.html_url,
        meta: `⭐ ${data.stargazers_count ?? 0}${data.language ? ' · ' + data.language : ''}`,
      }

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-card card-pop flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <img
            src={item.avatarUrl || 'https://avatars.githubusercontent.com/u/0?v=4'}
            alt={item.title}
            className={`w-11 h-11 object-cover bg-gray-100 ${isUser ? 'rounded-full' : 'rounded-lg'}`}
          />
          <div className="min-w-0 flex-1">
            <a
              href={item.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[14.5px] text-gray-800 hover:text-brand-600 truncate block"
            >
              {item.title}
            </a>
            <span
              className={`inline-block mt-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${
                isUser ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}
            >
              {isUser ? 'User' : 'Repository'}
            </span>
          </div>
        </div>

        <p className="text-[13px] text-gray-500 line-clamp-2 min-h-[2.4em]">{item.subtitle}</p>

        <div className="flex items-center justify-between pt-1 border-t border-gray-50">
          <span className="text-[12px] text-gray-400">{item.meta}</span>
          <button
            onClick={() => setShowSave(true)}
            className="flex items-center gap-1 text-brand-600 hover:text-brand-700 text-[13px] font-medium"
          >
            🔖 Save
          </button>
        </div>
      </div>

      {showSave && <SaveToCollectionModal item={item} onClose={() => setShowSave(false)} />}
    </>
  )
}
