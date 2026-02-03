import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { useAppSelector } from '../../store'

/**
 * Renders child routes only when user is not logged in.
 * If user is logged in (in Redux), redirects to dashboard.
 */
export function GuestOnly() {
  const user = useAppSelector((state) => state.auth.user)

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <Outlet />
}
