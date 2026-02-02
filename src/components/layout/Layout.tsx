import { Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function Layout() {
  const location = useLocation()
  const hideFooter = location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.SIGNUP || location.pathname === ROUTES.HOME

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 min-h-0 flex flex-col overflow-auto">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}
