import { createSlice } from '@reduxjs/toolkit'
import type { User } from '../../types/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  /** Tracks if user explicitly logged out in this SPA session. */
  hasLoggedOut: boolean
  /**
   * True until we've finished trying to restore session (e.g. getProfile on refresh).
   * Prevents protected pages from redirecting to login before session restore completes.
   */
  sessionRestoring: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  hasLoggedOut: false,
  sessionRestoring: true,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Stores complete user data from API (login, signup, or profile/view).
     * User object includes: _id, firstName, lastName, email, profilePicture,
     * about, skills, createdAt, updatedAt, etc.
     * This data persists in Redux and is available throughout the app.
     */
    setCredentials: (state, action: { payload: User }) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.hasLoggedOut = false
      state.sessionRestoring = false
    },
    setSessionRestoring: (state, action: { payload: boolean }) => {
      state.sessionRestoring = action.payload
    },
    updateConnectionCounts: (
      state,
      action: { payload: { pendingIncomingDelta?: number; acceptedDelta?: number } },
    ) => {
      if (!state.user) return
      const counts = state.user.connectionCounts ?? {
        pendingIncoming: 0,
        pendingOutgoing: 0,
        accepted: 0,
      }
      const next = {
        ...counts,
        pendingIncoming: Math.max(
          0,
          counts.pendingIncoming + (action.payload.pendingIncomingDelta ?? 0),
        ),
        accepted: Math.max(0, counts.accepted + (action.payload.acceptedDelta ?? 0)),
      }
      state.user = {
        ...state.user,
        connectionCounts: next,
      }
    },
    clearCredentials: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.hasLoggedOut = true
      state.sessionRestoring = false
    },
  },
})

export const { setCredentials, clearCredentials, updateConnectionCounts, setSessionRestoring } =
  authSlice.actions
export default authSlice.reducer
