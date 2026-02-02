import axios from 'axios'
import { api } from './client'
import type { AuthErrorResponse, AuthResponse, LoginPayload, SignupPayload } from '../types/auth'

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
