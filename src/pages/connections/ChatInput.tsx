interface ChatInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function ChatInput({ value, onChange, onSend, onKeyDown }: ChatInputProps) {
  return (
    <div className="p-3 sm:p-4 bg-base-100 border-t border-base-300 shrink-0">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Type message..."
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className="input input-bordered flex-1 min-w-0 min-h-11 sm:min-h-10"
        />
        <button
          type="button"
          onClick={onSend}
          className="btn btn-primary btn-square shrink-0 min-h-11 min-w-11 sm:min-h-10 sm:min-w-10 touch-manipulation"
          title="Send"
          aria-label="Send message"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
