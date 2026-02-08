import { api } from './client'

export interface Conversation {
  _id: string
  type: string
  participants: string[]
  name?: string
  createdAt: string
}

export interface GetDirectConversationResponse {
  conversation: Conversation
}

/**
 * Get or create a direct conversation with another user.
 * GET ${API_ROOT}/conversations/direct?withUserId=${otherUserId}
 * Call when user opens chat with a connection.
 */
export async function getOrCreateDirectConversation(
  withUserId: string
): Promise<GetDirectConversationResponse> {
  const { data } = await api.get<GetDirectConversationResponse>(
    `/conversations/direct?withUserId=${encodeURIComponent(withUserId)}`
  )
  return data
}
