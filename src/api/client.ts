import axios from 'axios'
import { API_BASE_URL } from '../constants'

/**
 * Shared axios instance for all API calls.
 * - baseURL and withCredentials set once; add interceptors here when needed
 *   (e.g. attach token, handle 401 redirect).
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})
