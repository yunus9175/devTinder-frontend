/**
 * Socket.IO client utilities for real-time chat.
 * Connects using API base URL and optional path (e.g. /api/socket.io).
 */
import { io, type Socket } from 'socket.io-client'
import { API_BASE_URL } from '../constants'

// ---------------------------------------------------------------------------
// Types (match backend: API and receiveMessage)
// ---------------------------------------------------------------------------

export interface ReadByEntry {
  userId: string
  readAt: string
}

/**
 * Message shape from API (GET /messages) and socket (receiveMessage).
 */
export interface Message {
  _id: string
  conversationId: string
  senderId: string
  content: string
  readBy: ReadByEntry[]
  createdAt: string
}

// ---------------------------------------------------------------------------
// Socket server URL and path
// ---------------------------------------------------------------------------

/**
 * Returns the URL (origin) the Socket.IO client should connect to.
 * If VITE_API_BASE_URL is set, uses that; else derives from API_BASE_URL or window.origin.
 */
function getSocketServerUrl(): string {
  if (typeof window === 'undefined') return ''
  try {
    const base = import.meta.env.VITE_API_BASE_URL as string | undefined
    if (base && (base.startsWith('http://') || base.startsWith('https://'))) {
      return new URL(base).origin
    }
    if (API_BASE_URL.startsWith('http://') || API_BASE_URL.startsWith('https://')) {
      return new URL(API_BASE_URL).origin
    }
    return window.location.origin
  } catch {
    return window.location.origin
  }
}

/** Socket path when backend uses a base path (e.g. /api/socket.io). */
export function getSocketPath(): string {
  return location.pathname === "localhost" ? '/socket.io' : '/api/socket.io'
}

// ---------------------------------------------------------------------------
// Connection & events
// ---------------------------------------------------------------------------

/**
 * Creates a new Socket.IO client and connects to the server.
 * Use path from getSocketPath() when API_BASE_PATH is set.
 * After connect, emit registerPresence({ userId }) once.
 */
export function createSocketConnection(): Socket {
  const url = getSocketServerUrl()
  return io(url, {
    path: getSocketPath(),
    withCredentials: true,
  })
}

/**
 * Event name the backend uses when it sends a new message to the room.
 */
export const MESSAGE_EVENT = 'receiveMessage'

// ---------------------------------------------------------------------------
// Presence (online / offline)
// ---------------------------------------------------------------------------
export const USER_ONLINE_EVENT = 'userOnline'
export const USER_OFFLINE_EVENT = 'userOffline'

// ---------------------------------------------------------------------------
// Typing indicators — emit { conversationId }; listen for { userId }
// ---------------------------------------------------------------------------
export const TYPING_EMIT = 'typing'
export const STOP_TYPING_EMIT = 'stopTyping'
export const USER_TYPING_EVENT = 'userTyping'
export const USER_STOPPED_TYPING_EVENT = 'userStoppedTyping'
