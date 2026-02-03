import { createSlice } from '@reduxjs/toolkit'
import type { User } from '../../types/auth'

interface FeedState {
  users: User[]
  loading: boolean
  error: string | null
}

const initialState: FeedState = {
  users: [],
  loading: false,
  error: null,
}

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeed: (state, action: { payload: User[] }) => {
      state.users = action.payload
      state.error = null
    },
    setFeedLoading: (state, action: { payload: boolean }) => {
      state.loading = action.payload
    },
    setFeedError: (state, action: { payload: string | null }) => {
      state.error = action.payload
      state.loading = false
    },
    clearFeed: (state) => {
      state.users = []
      state.error = null
      state.loading = false
    },
  },
})

export const { setFeed, setFeedLoading, setFeedError, clearFeed } = feedSlice.actions
export default feedSlice.reducer
