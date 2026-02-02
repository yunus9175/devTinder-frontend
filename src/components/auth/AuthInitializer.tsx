import { useEffect } from 'react'
import { getProfile } from '../../api/auth'
import { useAppDispatch, useAppSelector } from '../../store'
import { setCredentials } from '../../store/slices/authSlice'

/**
 * Restores user session from backend on app mount if user is logged in
 * (has session cookie) but Redux state is empty (after page refresh).
 * 
 * Calls /profile/view API and stores the complete user data (including
 * profilePicture, firstName, lastName, email, about, skills, etc.) in Redux
 * state so user info can be displayed continuously across the app.
 */
export function AuthInitializer() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  useEffect(() => {
    // Only fetch profile if user is not already in Redux (e.g., after refresh)
    if (!user) {
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
  }, [dispatch, user])

  return null
}
