import { DEFAULT_AVATAR, getProxiedFallback } from '../../lib/imageUtils'
import type { Message } from '../../lib/socket'
import { formatTime } from './useConnectionsChat'

interface MessageBubbleProps {
  message: Message
  isMe: boolean
  avatarUrl: string
}

export function MessageBubble({ message, isMe, avatarUrl }: MessageBubbleProps) {
  return (
    <div className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
      <div className="avatar shrink-0">
        <div className="w-13 rounded-full">
          <img
            src={avatarUrl}
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
      </div>
      <div
        className={`max-w-[85%] sm:max-w-[75%] md:max-w-[60%] rounded-2xl px-3 py-2 sm:px-4 ${isMe ? 'bg-primary text-primary-content rounded-br-md' : 'bg-base-300 text-base-content rounded-bl-md'}`}
      >
        <p className="text-sm whitespace-pre-wrap wrap-break-word">{message.content}</p>
        <p className={`text-xs mt-1 ${isMe ? 'text-primary-content/80' : 'text-base-content/60'}`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  )
}
