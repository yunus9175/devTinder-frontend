import type { User } from '../../types/auth'
import type { Message } from '../../lib/socket'
import { ChatHeader } from './ChatHeader'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'

interface ChatPanelProps {
  selectedConnection: User
  currentUser: User
  messages: Message[]
  inputMessage: string
  openingChat: boolean
  openConversationError: string | null
  onRetryOpenChat: () => void
  onlineUserIds: Set<string>
  typingUserId: string | null
  messagesScrollRef: React.RefObject<HTMLDivElement | null>
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  onBack: () => void
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSend: () => void
}

export function ChatPanel({
  selectedConnection,
  currentUser,
  messages,
  inputMessage,
  openingChat,
  openConversationError,
  onRetryOpenChat,
  onlineUserIds,
  typingUserId,
  messagesScrollRef,
  messagesEndRef,
  onBack,
  onInputChange,
  onSend,
}: ChatPanelProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
      {openConversationError && (
        <div className="shrink-0 flex items-center justify-between gap-3 px-3 py-2 bg-error/10 text-error text-sm border-b border-error/20">
          <span>{openConversationError}</span>
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={onRetryOpenChat}
          >
            Retry
          </button>
        </div>
      )}
      <ChatHeader
        connection={selectedConnection}
        isOnline={onlineUserIds.has(selectedConnection._id)}
        isTyping={typingUserId === selectedConnection._id}
        openingChat={openingChat}
        onBack={onBack}
      />
      <ChatMessages
        messages={messages}
        currentUser={currentUser}
        selectedConnection={selectedConnection}
        typingUserId={typingUserId}
        messagesScrollRef={messagesScrollRef}
        messagesEndRef={messagesEndRef}
      />
      <ChatInput
        value={inputMessage}
        onChange={onInputChange}
        onSend={onSend}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
