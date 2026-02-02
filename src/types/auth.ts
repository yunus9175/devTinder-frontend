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
