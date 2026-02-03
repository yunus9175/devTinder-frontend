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
    appendFeed: (state, action: { payload: User[] }) => {
      state.users = [...state.users, ...action.payload]
      state.error = null
    },
    popFeedUser: (state) => {
      if (state.users.length > 0) {
        state.users = state.users.slice(1)
      }
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

export const { setFeed, appendFeed, popFeedUser, setFeedLoading, setFeedError, clearFeed } =
  feedSlice.actions
export default feedSlice.reducer
