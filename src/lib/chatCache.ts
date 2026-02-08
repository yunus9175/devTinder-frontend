import type { Message } from './socket'

const CHAT_CACHE_KEY_PREFIX = 'devtinder_chat_cache_'
const MAX_MESSAGES_PER_CONVERSATION_CACHE = 50

export interface ChatCache {
  conversationIdByUserId: Record<string, string>
  messagesByConversationId: Record<string, Message[]>
}

export function loadChatCache(userId: string): ChatCache | null {
  try {
    const raw = sessionStorage.getItem(CHAT_CACHE_KEY_PREFIX + userId)
    if (!raw) return null
    const data = JSON.parse(raw) as ChatCache
    if (!data?.conversationIdByUserId || !data?.messagesByConversationId) return null
    return data
  } catch {
    return null
  }
}

export function saveChatCache(
  userId: string,
  conversationIdByUserId: Record<string, string>,
  messagesByConversationId: Record<string, Message[]>
): void {
  try {
    const capped: Record<string, Message[]> = {}
    for (const [cid, list] of Object.entries(messagesByConversationId)) {
      const arr = list.slice(-MAX_MESSAGES_PER_CONVERSATION_CACHE)
      if (arr.length) capped[cid] = arr
    }
    sessionStorage.setItem(
      CHAT_CACHE_KEY_PREFIX + userId,
      JSON.stringify({ conversationIdByUserId, messagesByConversationId: capped })
    )
  } catch {
    // ignore
  }
}
