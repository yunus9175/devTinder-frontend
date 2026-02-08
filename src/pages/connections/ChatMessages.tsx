import type { Message } from '../../lib/socket'
import type { User } from '../../types/auth'
import { displayName } from './useConnectionsChat'
import { MessageBubble } from './MessageBubble'
import { DEFAULT_AVATAR } from '../../lib/imageUtils'

interface ChatMessagesProps {
  messages: Message[]
  currentUser: User
  selectedConnection: User
  typingUserId: string | null
  messagesScrollRef: React.RefObject<HTMLDivElement | null>
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}

export function ChatMessages({
  messages,
  currentUser,
  selectedConnection,
  typingUserId,
  messagesScrollRef,
  messagesEndRef,
}: ChatMessagesProps) {
  const isTyping = typingUserId === selectedConnection._id

  return (
    <div
      ref={messagesScrollRef}
      className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4"
    >
      {messages.length === 0 && !isTyping && (
        <p className="text-center text-sm text-base-content/50 py-8">No messages yet. Say hi!</p>
      )}
      {messages.map((msg) => {
        const isMe = msg.senderId === currentUser._id
        const avatarUrl = isMe
          ? (currentUser.profilePicture?.trim() || DEFAULT_AVATAR)
          : (selectedConnection.profilePicture?.trim() || DEFAULT_AVATAR)
        return (
          <MessageBubble
            key={msg._id}
            message={msg}
            isMe={isMe}
            avatarUrl={avatarUrl}
          />
        )
      })}
      {isTyping && (
        <p className="text-sm text-base-content/60 italic py-1">
          {displayName(selectedConnection)} is typing...
        </p>
      )}
      <div ref={messagesEndRef} aria-hidden />
    </div>
  )
}
