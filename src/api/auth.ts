import axios from 'axios'
import { api } from './client'
import type {
  AuthErrorResponse,
  AuthResponse,
  ConnectionRequest,
  ConnectionsResponse,
  FeedResponse,
  LoginPayload,
  RequestsResponse,
  SignupPayload,
  UpdateProfilePayload,
  User,
} from '../types/auth'

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

/**
 * Fetches feed of users from GET /user/feed.
 * Backend returns { message: "...", data: User[] }.
 */
export async function getFeed(page = 1, limit = 10): Promise<FeedResponse> {
  try {
    const { data } = await api.get<FeedResponse>('/user/feed', {
      params: { page, limit },
    })
    if (data && typeof data === 'object' && Array.isArray(data.data)) {
      return { message: data.message ?? 'Success', data: data.data }
    }
    return { message: 'Success', data: [] }
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

/**
 * Sends an "interested" request for a user from the feed.
 * POST /request/send/interested/:userId
 */
export async function sendInterestedRequest(userId: string): Promise<void> {
  try {
    await api.post(`/request/send/interested/${userId}`)
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

/**
 * Marks a user as ignored from the feed.
 * Assuming backend supports POST /request/send/ignored/:userId.
 */
export async function sendIgnoredRequest(userId: string): Promise<void> {
  try {
    await api.post(`/request/send/ignored/${userId}`)
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

/**
 * Fetches connected users from GET /user/connection.
 * Backend returns { message: "...", data: User[] }.
 */
export async function getConnections(): Promise<ConnectionsResponse> {
  try {
    const { data } = await api.get<ConnectionsResponse>('/user/connection')
    if (data && typeof data === 'object' && Array.isArray(data.data)) {
      return { message: data.message ?? 'Success', data: data.data }
    }
    return { message: 'Success', data: [] }
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

/**
 * Fetches incoming connection requests from GET /user/requests/received.
 * Backend returns { message: "...", data: ConnectionRequest[] }.
 */
export async function getReceivedRequests(): Promise<RequestsResponse> {
  try {
    const { data } = await api.get<RequestsResponse>('/user/requests/received')
    if (data && typeof data === 'object' && Array.isArray((data as RequestsResponse).data)) {
      return {
        message: (data as RequestsResponse).message ?? 'Success',
        data: (data as RequestsResponse).data as ConnectionRequest[],
      }
    }
    return { message: 'Success', data: [] }
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

/**
 * Reviews a pending connection request via POST /request/review/{status}/{requestId}.
 * Status should be "accepted" or "rejected".
 */
export async function reviewRequest(
  requestId: string,
  status: 'accepted' | 'rejected',
): Promise<void> {
  try {
    await api.post(`/request/review/${status}/${requestId}`)
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

/**
 * Updates current user profile via PATCH /profile/edit.
 * Backend returns { message, data: User }. Redux should be updated with returned user.
 */
export async function updateProfile(payload: UpdateProfilePayload): Promise<AuthResponse> {
  try {
    const { data } = await api.patch('/profile/edit', {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim().toLowerCase(),
      ...(payload.age !== undefined && payload.age !== null && !Number.isNaN(payload.age) && { age: payload.age }),
      ...(payload.gender !== undefined && { gender: payload.gender.trim() || undefined }),
      ...(payload.profilePicture !== undefined && { profilePicture: payload.profilePicture.trim() || undefined }),
      ...(payload.about !== undefined && { about: payload.about.trim() || undefined }),
      ...(payload.skills !== undefined && { skills: payload.skills }),
    })

    if (data && typeof data === 'object' && 'data' in data) {
      return {
        message: data.message || 'Profile updated',
        user: data.data as User,
      }
    }
    if (data && typeof data === 'object' && 'user' in data) {
      return data as AuthResponse
    }
    return {
      message: 'Profile updated',
      user: data as User,
    }
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}
