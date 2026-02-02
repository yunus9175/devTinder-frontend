import { Link } from 'react-router-dom'
import { ROUTES } from '../constants'

export function LandingPage() {
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-gradient-to-b from-primary/10 via-base-100 to-base-200 overflow-x-hidden">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-8 pt-6 sm:pt-8">
        <div className="w-full max-w-lg mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-base-content leading-tight tracking-tight">
            Connect with developers.
          </h1>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-base-content/80 max-w-md mx-auto">
            Find your next coding buddy. Swipe, match, and build together.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to={ROUTES.SIGNUP}
              className="btn btn-primary btn-block sm:btn-wide btn-lg font-semibold text-base sm:text-lg"
            >
              Create account
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="btn btn-outline btn-primary btn-block sm:btn-wide btn-lg font-semibold text-base sm:text-lg"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Visual hint - card stack style */}
        <div className="mt-12 sm:mt-16 w-full max-w-sm mx-auto flex justify-center">
          <div className="relative w-64 sm:w-72 aspect-[3/4] max-h-[320px] rounded-2xl shadow-2xl overflow-hidden bg-base-100 border border-base-300">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-3xl sm:text-4xl">👋</span>
              </div>
              <p className="text-base sm:text-lg font-medium text-base-content">
                Match with devs
              </p>
              <p className="text-sm text-base-content/70 mt-1">
                Build your network
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-4 sm:py-6 text-center text-sm text-base-content/60 safe-area-padding">
        <p>By continuing, you agree to our Terms and Privacy Policy.</p>
      </footer>
    </div>
  )
}
