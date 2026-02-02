import axios from 'axios'
import { api } from './client'
import type { AuthErrorResponse, AuthResponse, LoginPayload, SignupPayload, User } from '../types/auth'

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.data) {
    const data = err.response.data as AuthErrorResponse
    return data.error ?? data.message ?? 'Request failed'
  }
  return err instanceof Error ? err.message : 'Request failed'
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>('/login', {
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    })
    return data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>('/signup', {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    })
    return data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

export async function logout(): Promise<void> {
  await api.post('/logout')
}

/**
 * Fetches current user profile from backend.
 * Stores the user data in Redux via AuthInitializer component.
 * Returns user object wrapped in AuthResponse format for consistency.
 * 
 * Backend returns: { message: "...", data: { _id, firstName, ... } }
 */
export async function getProfile(): Promise<AuthResponse> {
  try {
    const { data } = await api.get('/profile/view')

    // Backend returns { message: "...", data: {...} }
    if (data && typeof data === 'object' && 'data' in data) {
      return {
        message: data.message || 'Profile fetched successfully',
        user: data.data as User,
      }
    }

    // Fallback: if response has 'user' property (AuthResponse format)
    if (data && typeof data === 'object' && 'user' in data) {
      return data as AuthResponse
    }

    // Fallback: if response is user object directly, wrap it
    return {
      message: 'Profile fetched successfully',
      user: data as User,
    }
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}
