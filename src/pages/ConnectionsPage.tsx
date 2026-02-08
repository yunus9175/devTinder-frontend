import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants'
import {
  useConnectionsChat,
  ConnectionsList,
  ChatPanel,
  EmptyChatPlaceholder,
  PremiumUpsell,
} from './connections'

export function Connections() {
  const navigate = useNavigate()
  const chat = useConnectionsChat()
  const {
    user,
    loading,
    error,
    isPremium,
    searchQuery,
    setSearchQuery,
    selectedConnection,
    setSelectedConnection,
    selectConnection,
    filteredUsers,
    messages,
    inputMessage,
    handleSend,
    handleInputChange,
    openingChat,
    onlineUserIds,
    typingUserId,
    unreadByConnection,
    lastMessagePreview,
    messagesEndRef,
    messagesScrollRef,
  } = chat

  useEffect(() => {
    if (!user) navigate(ROUTES.LOGIN, { replace: true })
  }, [user, navigate])

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center safe-area-padding px-4">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="mt-4 text-base-content/70">Loading connections...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center safe-area-padding px-4">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
      </div>
    )
  }

  if (!isPremium) {
    return <PremiumUpsell connectionCount={filteredUsers.length} />
  }

  const showListOnMobile = !selectedConnection
  const showChatOnMobile = !!selectedConnection

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-base-200 safe-area-padding">
      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        <aside
          className={`w-full md:w-80 lg:w-96 flex flex-col bg-base-100 border-r border-base-300 shrink-0 min-h-0 overflow-hidden ${showListOnMobile ? 'flex' : 'hidden md:flex'}`}
        >
          <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
            <ConnectionsList
              users={filteredUsers}
              selectedConnection={selectedConnection}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              lastMessagePreview={lastMessagePreview}
              unreadByConnection={unreadByConnection}
              onlineUserIds={onlineUserIds}
              onSelectConnection={selectConnection}
            />
          </div>
        </aside>

        <section
          className={`flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden bg-base-200 ${showChatOnMobile ? 'flex' : 'hidden md:flex'}`}
        >
          {!selectedConnection ? (
            <EmptyChatPlaceholder />
          ) : (
            <ChatPanel
              selectedConnection={selectedConnection}
              currentUser={user}
              messages={messages}
              inputMessage={inputMessage}
              openingChat={openingChat}
              onlineUserIds={onlineUserIds}
              typingUserId={typingUserId}
              messagesScrollRef={messagesScrollRef}
              messagesEndRef={messagesEndRef}
              onBack={() => setSelectedConnection(null)}
              onInputChange={handleInputChange}
              onSend={handleSend}
            />
          )}
        </section>
      </div>
    </div>
  )
}
