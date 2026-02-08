import type { User } from '../../types/auth'
import { ConnectionListItem } from './ConnectionListItem'

interface ConnectionsListProps {
  users: User[]
  selectedConnection: User | null
  searchQuery: string
  onSearchChange: (value: string) => void
  lastMessagePreview: (u: User) => string
  unreadByConnection: Record<string, number>
  onlineUserIds: Set<string>
  onSelectConnection: (u: User) => void
}

export function ConnectionsList({
  users,
  selectedConnection,
  searchQuery,
  onSearchChange,
  lastMessagePreview,
  unreadByConnection,
  onlineUserIds,
  onSelectConnection,
}: ConnectionsListProps) {
  return (
    <>
      <div className="p-4 border-b border-base-300 shrink-0">
        <h1 className="text-lg font-bold text-base-content">Connections</h1>
        <p className="text-xs text-base-content/60 mt-0.5">Chat with your connections</p>
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Search name"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input input-bordered input-sm w-full pl-9 bg-base-200 min-h-10"
          />
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <ul className="flex-1 min-h-0 overflow-y-auto">
        {users.length === 0 ? (
          <li className="p-4 text-center text-sm text-base-content/60">No connections match.</li>
        ) : (
          users.map((u) => (
            <ConnectionListItem
              key={u._id}
              connection={u}
              isSelected={selectedConnection?._id === u._id}
              lastMessagePreview={lastMessagePreview(u)}
              unreadCount={unreadByConnection[u._id] ?? 0}
              isOnline={onlineUserIds.has(u._id)}
              onSelect={onSelectConnection}
            />
          ))
        )}
      </ul>
    </>
  )
}
