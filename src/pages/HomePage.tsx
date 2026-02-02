import { Link } from 'react-router-dom'
import { ROUTES } from '../constants'

export function HomePage() {
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center p-4 sm:p-8 bg-base-200 safe-area-padding">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body p-5 sm:p-8 items-center text-center">
          <h1 className="card-title text-2xl sm:text-3xl font-bold text-primary">
            DevTinder
          </h1>
          <p className="text-base-content/80 text-sm sm:text-base mt-2">
            Connect with developers. Find your next coding buddy.
          </p>
          <div className="card-actions justify-center gap-2 sm:gap-3 mt-6 flex-wrap">
            <Link
              to={ROUTES.LOGIN}
              className="btn btn-primary btn-block sm:btn-wide min-h-12 touch-manipulation"
            >
              Log in
            </Link>
            <Link
              to={ROUTES.SIGNUP}
              className="btn btn-outline btn-primary btn-block sm:btn-wide min-h-12 touch-manipulation"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
