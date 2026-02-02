import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  alternateLabel: string
  alternateTo: string
  children: React.ReactNode
}

export function AuthLayout({
  title,
  subtitle,
  alternateLabel,
  alternateTo,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-br from-base-200 via-base-100 to-base-200 safe-area-padding">
      {/* Form panel */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-8 pt-6 sm:pt-8">
        <div className="w-full max-w-[400px]">
          <div className="rounded-2xl sm:rounded-3xl bg-base-100/95 sm:bg-base-100 shadow-xl border border-base-300/50 backdrop-blur-sm p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-base-content tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm sm:text-base text-base-content/70">
                  {subtitle}
                </p>
              )}
            </div>
            {children}
            <div className="mt-6 sm:mt-8 pt-6 border-t border-base-300/50">
              <p className="text-center text-sm text-base-content/70">
                {alternateLabel}{' '}
                <Link
                  to={alternateTo}
                  className="link link-primary font-semibold hover:underline"
                >
                  {alternateTo === ROUTES.SIGNUP ? 'Sign up' : 'Log in'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
