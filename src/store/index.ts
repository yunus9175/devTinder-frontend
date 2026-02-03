import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import authReducer from './slices/authSlice'
import connectionsReducer from './slices/connectionsSlice'
import feedReducer from './slices/feedSlice'
import requestsReducer from './slices/requestsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    connections: connectionsReducer,
    requests: requestsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
