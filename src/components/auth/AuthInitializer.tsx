import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getProfile } from '../../api/auth'
import { ROUTES, SESSION_COOKIE_NAME } from '../../constants'
import { useAppDispatch, useAppSelector } from '../../store'
import { setCredentials } from '../../store/slices/authSlice'

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
 * Does not call when on Home (landing), Login, or Signup page.
 * Only calls when session cookie is present (user not logged out), if SESSION_COOKIE_NAME is set.
 */
export function AuthInitializer() {
  const dispatch = useAppDispatch()
  const { user, hasLoggedOut } = useAppSelector((state) => state.auth)
  const { pathname } = useLocation()

  useEffect(() => {
    // If user explicitly logged out in this SPA session, never auto-fetch profile again.
    if (hasLoggedOut) return
    // Skip auto-fetch on public auth routes (landing/login/signup)
    if (SKIP_PROFILE_ROUTES.includes(pathname)) return
    // Only call if session cookie is present (user not logged out), when cookie name is configured
    if (!user && hasSessionCookie()) {
      getProfile()
        .then(({ user }) => {
          // Store complete user data in Redux state
          // This includes: _id, firstName, lastName, email, profilePicture,
          // about, skills, createdAt, updatedAt, etc.
          dispatch(setCredentials(user))
        })
        .catch((err) => {
          // Silently fail - user is not logged in or session expired
          // Redux state remains empty, user will see login/signup pages
          console.debug('Failed to fetch profile (user not logged in):', err)
        })
    }
  }, [dispatch, user, pathname, hasLoggedOut])

  return null
}
