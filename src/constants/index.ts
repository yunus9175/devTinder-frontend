/** Base URL for backend API. Default to /api so Nginx/Vite proxy can route it. */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

/** Backend expects validator.isStrongPassword: min 8 chars, 1 lower, 1 upper, 1 number, 1 symbol */
export const PASSWORD_MIN_LENGTH = 8
export const NAME_MIN_LENGTH = 3
export const NAME_MAX_LENGTH = 50

export const ROUTES = {
  /** Landing (Tinder-style hero) */
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  /** After login */
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  CONNECTIONS: '/connections',
  REQUESTS: '/requests',
} as const

/**
 * Session cookie name set by backend on login (e.g. "connect.sid" for Express).
 * If set, profile API is only called when this cookie exists (user not logged out).
 * Leave unset if backend uses HttpOnly session cookie (not readable from JS).
 */
export const SESSION_COOKIE_NAME = import.meta.env
  .VITE_SESSION_COOKIE_NAME as string | undefined
