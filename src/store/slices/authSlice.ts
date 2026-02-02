import { createSlice } from '@reduxjs/toolkit'
import type { User } from '../../types/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
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
    },
    clearCredentials: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
