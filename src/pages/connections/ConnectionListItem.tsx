import { DEFAULT_AVATAR, getProxiedFallback } from '../../lib/imageUtils'
import type { User } from '../../types/auth'
import { displayName } from './useConnectionsChat'

interface ConnectionListItemProps {
  connection: User
  isSelected: boolean
  lastMessagePreview: string
  unreadCount: number
  isOnline: boolean
  onSelect: (u: User) => void
}

export function ConnectionListItem({
  connection,
  isSelected,
  lastMessagePreview,
  unreadCount,
  isOnline,
  onSelect,
}: ConnectionListItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(connection)}
        className={`w-full flex items-center gap-3 px-4 py-3.5 min-h-16 text-left hover:bg-base-200 active:bg-base-300 transition-colors touch-manipulation ${isSelected ? 'bg-primary/10 border-l-2 border-primary md:border-l-2' : 'border-l-2 border-transparent'}`}
      >
        <div className="avatar shrink-0 relative">
          <div className="w-12 rounded-full ring ring-base-300 ring-offset-0">
            <img
              src={connection.profilePicture?.trim() || DEFAULT_AVATAR}
              alt=""
              referrerPolicy="no-referrer"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                const proxied = getProxiedFallback(img.src)
                if (proxied && img.src !== proxied) img.src = proxied
                else img.src = DEFAULT_AVATAR
              }}
            />
          </div>
          {isOnline && (
            <span
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-base-100"
              aria-label="Online"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-base-content truncate">{displayName(connection)}</p>
          <p className="text-xs text-base-content/60 truncate">{lastMessagePreview}</p>
        </div>
        {unreadCount > 0 && (
          <span
            className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-success px-1.5 text-xs font-semibold text-white"
            aria-label={`${unreadCount} unread`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {isSelected && (
          <svg className="w-4 h-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    </li>
  )
}
