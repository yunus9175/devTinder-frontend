import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UNAUTHORIZED_EVENT } from '../../api/client'
import { ROUTES } from '../../constants'
import { useAppDispatch } from '../../store'
import { clearCredentials } from '../../store/slices/authSlice'

const TOAST_DURATION_MS = 2000
const MESSAGE = 'Session expired. Logging out...'

/**
 * Listens for 401 from any API (via app:unauthorized event from axios interceptor).
 * Shows a toast for 2 seconds, then clears auth state and redirects to login.
 */
export function UnauthorizedHandler() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleUnauthorized = () => {
      setShowToast(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        dispatch(clearCredentials())
        navigate(ROUTES.LOGIN, { replace: true })
        setShowToast(false)
        timeoutRef.current = null
      }, TOAST_DURATION_MS)
    }

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [dispatch, navigate])

  if (!showToast) return null

  return (
    <div className="toast toast-top toast-center z-100">
      <div className="alert alert-warning shadow-lg">
        <span>{MESSAGE}</span>
      </div>
    </div>
  )
}
