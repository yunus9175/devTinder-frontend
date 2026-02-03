import { createSlice } from '@reduxjs/toolkit'
import type { User } from '../../types/auth'

interface ConnectionsState {
  users: User[]
  loading: boolean
  error: string | null
}

const initialState: ConnectionsState = {
  users: [],
  loading: false,
  error: null,
}

export const connectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    setConnections: (state, action: { payload: User[] }) => {
      state.users = action.payload
      state.error = null
    },
    setConnectionsLoading: (state, action: { payload: boolean }) => {
      state.loading = action.payload
    },
    setConnectionsError: (state, action: { payload: string | null }) => {
      state.error = action.payload
      state.loading = false
    },
    clearConnections: (state) => {
      state.users = []
      state.error = null
      state.loading = false
    },
  },
})

export const { setConnections, setConnectionsLoading, setConnectionsError, clearConnections } =
  connectionsSlice.actions
export default connectionsSlice.reducer
