export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

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
} as const
