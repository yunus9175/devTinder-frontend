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
