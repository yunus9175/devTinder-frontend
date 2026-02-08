import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getConnections } from '../../api/auth'
import { getOrCreateDirectConversation } from '../../api/conversations'
import { getMessages, markMessageAsRead } from '../../api/messages'
import { loadChatCache, saveChatCache } from '../../lib/chatCache'
import {
  createSocketConnection,
  MESSAGE_EVENT,
  USER_OFFLINE_EVENT,
  USER_ONLINE_EVENT,
  USER_STOPPED_TYPING_EVENT,
  USER_TYPING_EVENT,
  STOP_TYPING_EMIT,
  TYPING_EMIT,
  type Message,
} from '../../lib/socket'
import type { Socket } from 'socket.io-client'
import { useAppDispatch, useAppSelector } from '../../store'
import {
  setConnections,
  setConnectionsError,
  setConnectionsLoading,
} from '../../store/slices/connectionsSlice'
import type { User } from '../../types/auth'

export function displayName(u: User): string {
  return [u.firstName?.trim(), u.lastName?.trim()].filter(Boolean).join(' ') || 'Unknown'
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function useConnectionsChat() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { users, loading, error } = useAppSelector((state) => state.connections)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConnection, setSelectedConnection] = useState<User | null>(null)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [conversationIdByUserId, setConversationIdByUserId] = useState<Record<string, string>>({})
  const [messagesByConversationId, setMessagesByConversationId] = useState<Record<string, Message[]>>({})
  const [inputMessage, setInputMessage] = useState('')
  const [openingChat, setOpeningChat] = useState(false)
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set())
  const [typingUserId, setTypingUserId] = useState<string | null>(null)
  const [unreadByConnection, setUnreadByConnection] = useState<Record<string, number>>({})

  const socketRef = useRef<Socket | null>(null)
  const selectedConnectionIdRef = useRef<string | null>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stopTypingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previousConversationIdRef = useRef<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const messagesScrollRef = useRef<HTMLDivElement | null>(null)
  const markedReadIdsRef = useRef<Set<string>>(new Set())

  selectedConnectionIdRef.current = selectedConnection?._id ?? null

  // Load connections once when user is set
  useEffect(() => {
    if (!user) return
    dispatch(setConnectionsLoading(true))
    getConnections()
      .then(({ data }) => dispatch(setConnections(data)))
      .catch((err) =>
        dispatch(setConnectionsError(err instanceof Error ? err.message : 'Failed to load connections'))
      )
      .finally(() => dispatch(setConnectionsLoading(false)))
  }, [user, dispatch])

  // Restore chat cache after refresh
  useEffect(() => {
    if (!user?.isPremium || !user._id) return
    const cached = loadChatCache(user._id)
    if (cached) {
      setConversationIdByUserId((prev) => (Object.keys(prev).length ? prev : cached.conversationIdByUserId))
      setMessagesByConversationId((prev) => (Object.keys(prev).length ? prev : cached.messagesByConversationId))
    }
  }, [user?.isPremium, user?._id])

  // Persist chat cache
  useEffect(() => {
    if (!user?._id) return
    saveChatCache(user._id, conversationIdByUserId, messagesByConversationId)
  }, [user?._id, conversationIdByUserId, messagesByConversationId])

  // Socket: connect, register presence, handle messages & presence & typing
  useEffect(() => {
    if (!user?.isPremium) return
    const socket = createSocketConnection()
    socketRef.current = socket

    const onConnectError = (err: Error) => console.error('[Socket] connect_error:', err.message)
    const onConnect = () => socket.emit('registerPresence', { userId: user._id })

    const onMessage = (message: Message) => {
      setMessagesByConversationId((prev) => {
        const cid = message.conversationId
        const existing = prev[cid] ?? []
        if (existing.some((m) => m._id === message._id)) {
          return { ...prev, [cid]: existing.map((m) => (m._id === message._id ? message : m)) }
        }
        if (message.senderId === user._id) {
          const idx = existing.findIndex(
            (m) => m.senderId === user._id && m.content === message.content && m._id.startsWith('msg-')
          )
          if (idx !== -1) {
            const next = [...existing]
            next[idx] = message
            return { ...prev, [cid]: next }
          }
        }
        return { ...prev, [cid]: [...existing, message] }
      })
      setTypingUserId((c) => (c === message.senderId ? null : c))
      setOnlineUserIds((prev) => new Set(prev).add(message.senderId))
      if (message.senderId !== user._id) {
        setUnreadByConnection((prev) => ({
          ...prev,
          [message.senderId]: (prev[message.senderId] ?? 0) + 1,
        }))
      }
    }

    socket.on('connect_error', onConnectError)
    socket.on('connect', onConnect)
    socket.on(MESSAGE_EVENT, onMessage)
    socket.on(USER_ONLINE_EVENT, (d: { userId: string }) => setOnlineUserIds((p) => new Set(p).add(d.userId)))
    socket.on(USER_OFFLINE_EVENT, (d: { userId: string }) =>
      setOnlineUserIds((p) => {
        const next = new Set(p)
        next.delete(d.userId)
        return next
      })
    )
    socket.on(USER_TYPING_EVENT, (d: { userId: string }) => {
      setTypingUserId(d.userId)
      setOnlineUserIds((p) => new Set(p).add(d.userId))
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => setTypingUserId(null), 3000)
    })
    socket.on(USER_STOPPED_TYPING_EVENT, (d: { userId: string }) => {
      setTypingUserId((c) => (c === d.userId ? null : c))
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
    })

    if (socket.connected) onConnect()

    return () => {
      socket.off('connect_error', onConnectError)
      socket.off('connect', onConnect)
      socket.off(MESSAGE_EVENT, onMessage)
      socket.off(USER_ONLINE_EVENT)
      socket.off(USER_OFFLINE_EVENT)
      socket.off(USER_TYPING_EVENT)
      socket.off(USER_STOPPED_TYPING_EVENT)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      if (stopTypingTimerRef.current) clearTimeout(stopTypingTimerRef.current)
      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current)
      if (socket.connected && previousConversationIdRef.current) {
        socket.emit('leaveChat', { conversationId: previousConversationIdRef.current })
      }
      socket.disconnect()
      socketRef.current = null
    }
  }, [user?.isPremium, user?._id])

  // Open chat: leave previous, get conversation, load messages, join room. Deselect: leave room.
  useEffect(() => {
    if (!user?.isPremium) return
    if (!selectedConnection) {
      if (currentConversationId && socketRef.current?.connected) {
        socketRef.current.emit('leaveChat', { conversationId: currentConversationId })
      }
      previousConversationIdRef.current = null
      setCurrentConversationId(null)
      return
    }
    const otherUserId = selectedConnection._id
    setCurrentConversationId(null)
    setOpeningChat(true)
    const leavePrevious = () => {
      if (previousConversationIdRef.current && socketRef.current?.connected) {
        socketRef.current.emit('leaveChat', { conversationId: previousConversationIdRef.current })
      }
    }
    getOrCreateDirectConversation(otherUserId)
      .then(({ conversation }) => {
        leavePrevious()
        const cid = conversation._id
        previousConversationIdRef.current = cid
        setCurrentConversationId(cid)
        setConversationIdByUserId((p) => ({ ...p, [otherUserId]: cid }))
        setUnreadByConnection((p) => ({ ...p, [otherUserId]: 0 }))
        return getMessages(cid, 20)
      })
      .then(({ messages: list }) => {
        const cid = previousConversationIdRef.current
        if (cid) {
          setMessagesByConversationId((p) => ({ ...p, [cid]: list }))
        }
        if (socketRef.current?.connected && previousConversationIdRef.current) {
          socketRef.current.emit('joinChat', { conversationId: previousConversationIdRef.current })
        }
      })
      .catch((err) => {
        console.error('Open chat error:', err)
        setSelectedConnection(null)
      })
      .finally(() => setOpeningChat(false))
  }, [user?.isPremium, selectedConnection?._id])

  // Mark as read: only for messages we haven't already marked (avoid duplicate API calls)
  useEffect(() => {
    if (!user || !currentConversationId) return
    const messages = messagesByConversationId[currentConversationId] ?? []
    const fromOther = messages.filter((m) => m.senderId !== user._id)
    fromOther.forEach((m) => {
      if (markedReadIdsRef.current.has(m._id)) return
      markedReadIdsRef.current.add(m._id)
      markMessageAsRead(m._id).catch(() => {})
    })
  }, [user, currentConversationId, messagesByConversationId])

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => displayName(u).toLowerCase().includes(q))
  }, [users, searchQuery])

  const messages = useMemo(() => {
    if (!currentConversationId) return []
    const list = messagesByConversationId[currentConversationId] ?? []
    return [...list].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
  }, [currentConversationId, messagesByConversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, typingUserId, selectedConnection?._id])

  const handleSend = useCallback(() => {
    const content = inputMessage.trim()
    if (!content || !currentConversationId || !user) return
    const tempId = `msg-${Date.now()}`
    const optimistic: Message = {
      _id: tempId,
      conversationId: currentConversationId,
      senderId: user._id,
      content,
      readBy: [],
      createdAt: new Date().toISOString(),
    }
    socketRef.current?.emit('sendMessage', { conversationId: currentConversationId, senderId: user._id, content })
    socketRef.current?.emit(STOP_TYPING_EMIT, { conversationId: currentConversationId })
    setMessagesByConversationId((p) => ({
      ...p,
      [currentConversationId]: [...(p[currentConversationId] ?? []), optimistic],
    }))
    setInputMessage('')
  }, [inputMessage, currentConversationId, user])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputMessage(e.target.value)
      if (!currentConversationId || !user?.isPremium) return
      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current)
      typingDebounceRef.current = setTimeout(() => {
        socketRef.current?.emit(TYPING_EMIT, { conversationId: currentConversationId })
        typingDebounceRef.current = null
      }, 300)
      if (stopTypingTimerRef.current) clearTimeout(stopTypingTimerRef.current)
      stopTypingTimerRef.current = setTimeout(() => {
        socketRef.current?.emit(STOP_TYPING_EMIT, { conversationId: currentConversationId })
        stopTypingTimerRef.current = null
      }, 2000)
    },
    [currentConversationId, user]
  )

  const lastMessagePreview = useCallback(
    (connectionUser: User): string => {
      const cid = conversationIdByUserId[connectionUser._id]
      if (!cid) return 'No messages yet'
      const list = messagesByConversationId[cid] ?? []
      const sorted = [...list].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      const last = sorted[sorted.length - 1]
      if (!last) return 'No messages yet'
      const snippet = last.content.slice(0, 28)
      const suffix = last.content.length > 28 ? '...' : ''
      return last.senderId === user?._id ? `You: ${snippet}${suffix}` : `${snippet}${suffix}`
    },
    [conversationIdByUserId, messagesByConversationId, user?._id]
  )

  const selectConnection = useCallback((u: User) => {
    setSelectedConnection(u)
    setUnreadByConnection((p) => ({ ...p, [u._id]: 0 }))
  }, [])

  return {
    user,
    loading,
    error,
    isPremium: user?.isPremium === true,
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
    formatTime,
    displayName,
    messagesEndRef,
    messagesScrollRef,
  }
}
