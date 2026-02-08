import axios from 'axios'
import { API_ROOT } from '../constants'

/**
 * Shared axios instance for all API calls.
 * - baseURL and withCredentials set once.
 * - On 401 we dispatch a custom event; UnauthorizedHandler in the app shows toast, logs out, redirects.
 */
export const api = axios.create({
  baseURL: API_ROOT,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

/** Custom event name for 401 Unauthorized – app shows toast, then logout + redirect to login. */
export const UNAUTHORIZED_EVENT = 'app:unauthorized'

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT))
    }
    return Promise.reject(error)
  },
)
