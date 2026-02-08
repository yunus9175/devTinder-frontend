import { api } from './client'

export interface ReadByEntry {
  userId: string
  readAt: string
}

export interface Message {
  _id: string
  conversationId: string
  senderId: string
  content: string
  readBy: ReadByEntry[]
  createdAt: string
}

export interface GetMessagesResponse {
  messages: Message[]
}

/**
 * Load message history for a conversation.
 * GET ${API_ROOT}/messages?conversationId=...&limit=20&before=...
 * Use `before` with the oldest message _id for "load more" (older messages).
 */
export async function getMessages(
  conversationId: string,
  limit: number = 20,
  before?: string
): Promise<GetMessagesResponse> {
  const params = new URLSearchParams({
    conversationId,
    limit: String(Math.min(100, Math.max(1, limit))),
  })
  if (before) params.set('before', before)
  const { data } = await api.get<GetMessagesResponse>(`/messages?${params.toString()}`)
  return data
}

/**
 * Mark a message as read.
 * PATCH ${API_ROOT}/messages/:messageId/read
 */
export async function markMessageAsRead(messageId: string): Promise<void> {
  await api.patch(`/messages/${encodeURIComponent(messageId)}/read`)
}
