import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'

interface PremiumUpsellProps {
  connectionCount: number
}

export function PremiumUpsell({ connectionCount }: PremiumUpsellProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-base-200 safe-area-padding">
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8">
        <div className="card bg-base-100 border border-base-300 shadow-xl max-w-md w-full">
          <div className="card-body items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="card-title text-xl">Chat with your connections</h2>
            <p className="text-base-content/70 text-sm">
              Upgrade to Premium to send messages and chat with your connections.
            </p>
            <div className="card-actions mt-4">
              <Link to={ROUTES.PAYMENT} className="btn btn-primary">
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-6 text-sm text-base-content/60">
          You have {connectionCount} connection{connectionCount !== 1 ? 's' : ''}.
        </p>
      </main>
    </div>
  )
}
