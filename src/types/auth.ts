export interface User {
  _id: string
  firstName: string
  lastName?: string
  email: string
  age?: number
  gender?: string
  profilePicture?: string
  about?: string
  skills?: string[]
  createdAt?: string
  updatedAt?: string
  connectionCounts?: {
    pendingIncoming: number
    pendingOutgoing: number
    accepted: number
  }
}

export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  user: User
}

export interface AuthErrorResponse {
  message: string
  error?: string
}

/** Response from GET /user/feed – list of users for the feed. */
export interface FeedResponse {
  message: string
  data: User[]
}

/** Response from GET /user/connection – list of connected users. */
export interface ConnectionsResponse {
  message: string
  data: User[]
}

/** Single incoming connection/request (from another user). */
export interface ConnectionRequest {
  _id: string
  fromUserId: User
  toUserId: string
  status: string
  createdAt: string
  updatedAt: string
}

/** Response from GET /user/requests/received – list of pending requests. */
export interface RequestsResponse {
  message: string
  data: ConnectionRequest[]
}

/** Payload for PATCH profile/view – no password. */
export interface UpdateProfilePayload {
  firstName: string
  lastName: string
  email: string
  age?: number
  gender?: string
  profilePicture?: string
  about?: string
  skills?: string[]
}
