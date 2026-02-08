import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getProfile } from '../../api/auth'
import { ROUTES, SESSION_COOKIE_NAME } from '../../constants'
import { useAppDispatch, useAppSelector } from '../../store'
import { setCredentials, setSessionRestoring } from '../../store/slices/authSlice'

/** Routes where we skip profile fetch (guest/landing or auth flow). */
const SKIP_PROFILE_ROUTES: string[] = [ROUTES.HOME, ROUTES.LOGIN, ROUTES.SIGNUP]

/** True if no cookie name configured (call API) or session cookie is present (user not logged out). */
function hasSessionCookie(): boolean {
  if (!SESSION_COOKIE_NAME) return true
  return document.cookie
    .split(';')
    .some((c) => c.trim().startsWith(`${SESSION_COOKIE_NAME}=`))
}

/**
 * Restores user session from backend on app mount if user is logged in
 * (has session cookie) but Redux state is empty (after page refresh).
 *
 * Calls /profile/view API and stores the complete user data (including
 * profilePicture, firstName, lastName, email, about, skills, etc.) in Redux
 * state so user info can be displayed continuously across the app.
 * Sets sessionRestoring false when done so protected pages know whether to
 * show loading or redirect to login (avoids redirect-to-login on refresh).
 */
export function AuthInitializer() {
  const dispatch = useAppDispatch()
  const { user, hasLoggedOut } = useAppSelector((state) => state.auth)
  const { pathname } = useLocation()

  useEffect(() => {
    // If user explicitly logged out in this SPA session, never auto-fetch profile again.
    if (hasLoggedOut) {
      dispatch(setSessionRestoring(false))
      return
    }
    // On public auth routes we're not restoring session for a protected page.
    if (SKIP_PROFILE_ROUTES.includes(pathname)) {
      dispatch(setSessionRestoring(false))
      return
    }
    // Already have user (e.g. just logged in or restored earlier).
    if (user) {
      dispatch(setSessionRestoring(false))
      return
    }
    // No session cookie: not logged in, allow protected pages to redirect to login.
    if (!hasSessionCookie()) {
      dispatch(setSessionRestoring(false))
      return
    }
    // Have cookie but no user: restore session so we don't redirect before fetch completes.
    getProfile()
      .then(({ user }) => {
        dispatch(setCredentials(user))
      })
      .catch((err) => {
        console.debug('Failed to fetch profile (user not logged in):', err)
      })
      .finally(() => {
        dispatch(setSessionRestoring(false))
      })
  }, [dispatch, user, pathname, hasLoggedOut])

  return null
}
