import { DEFAULT_AVATAR, getProxiedFallback } from '../../lib/imageUtils'
import type { User } from '../../types/auth'
import { displayName } from './useConnectionsChat'

interface ChatHeaderProps {
  connection: User
  isOnline: boolean
  isTyping: boolean
  openingChat: boolean
  onBack: () => void
}

export function ChatHeader({ connection, isOnline, isTyping, openingChat, onBack }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 py-3 sm:px-4 bg-base-100 border-b border-base-300 shrink-0">
      {openingChat && (
        <span className="loading loading-spinner loading-sm text-primary shrink-0" aria-hidden />
      )}
      <button
        type="button"
        onClick={onBack}
        className="btn btn-ghost btn-sm btn-circle md:hidden shrink-0"
        aria-label="Back to connections"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div className="avatar shrink-0 relative">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full ring ring-base-300 ring-offset-0">
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
              className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-success border-2 border-base-100"
              aria-label="Online"
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-base-content truncate text-sm sm:text-base">{displayName(connection)}</p>
          <p className="text-xs text-base-content/70">
            {isTyping ? (
              <span className="italic text-primary">typing...</span>
            ) : isOnline ? (
              <span className="text-success">Online</span>
            ) : (
              'Offline'
            )}
          </p>
        </div>
      </div>
      <button type="button" className="btn btn-ghost btn-sm btn-circle min-h-9 min-w-9" title="Info" aria-label="Info">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
  )
}
