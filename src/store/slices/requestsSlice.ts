import { createSlice } from '@reduxjs/toolkit'
import type { ConnectionRequest } from '../../types/auth'

interface RequestsState {
  items: ConnectionRequest[]
  loading: boolean
  error: string | null
}

const initialState: RequestsState = {
  items: [],
  loading: false,
  error: null,
}

export const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setRequests: (state, action: { payload: ConnectionRequest[] }) => {
      state.items = action.payload
      state.error = null
    },
    setRequestsLoading: (state, action: { payload: boolean }) => {
      state.loading = action.payload
    },
    setRequestsError: (state, action: { payload: string | null }) => {
      state.error = action.payload
      state.loading = false
    },
    clearRequests: (state) => {
      state.items = []
      state.error = null
      state.loading = false
    },
    removeRequest: (state, action: { payload: string }) => {
      state.items = state.items.filter((req) => req._id !== action.payload)
    },
  },
})

export const { setRequests, setRequestsLoading, setRequestsError, clearRequests, removeRequest } =
  requestsSlice.actions
export default requestsSlice.reducer

