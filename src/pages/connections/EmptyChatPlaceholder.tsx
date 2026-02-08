export function EmptyChatPlaceholder() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
      <div className="text-center text-base-content/60 max-w-xs">
        <svg className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="font-medium">Select a connection to start chatting</p>
        <p className="text-sm mt-1">Choose someone from the list</p>
      </div>
    </div>
  )
}
