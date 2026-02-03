import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getConnections } from '../api/auth'
import { ProfileCard } from '../components/profile'
import { ROUTES } from '../constants'
import { useAppDispatch, useAppSelector } from '../store'
import {
  setConnections,
  setConnectionsError,
  setConnectionsLoading,
} from '../store/slices/connectionsSlice'
import type { User } from '../types/auth'

const DEFAULT_AVATAR =
  'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'

function userToDisplayName(u: User): string {
  return [u.firstName?.trim(), u.lastName?.trim()].filter(Boolean).join(' ') || 'Unknown'
}

function userToDisplayAgeGender(u: User): string {
  const parts: string[] = []
  if (u.age != null && u.age > 0) parts.push(String(u.age))
  if (u.gender?.trim()) parts.push(u.gender.trim())
  return parts.join(', ') || ''
}

export function Connections() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { users, loading, error } = useAppSelector((state) => state.connections)

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN, { replace: true })
      return
    }
    dispatch(setConnectionsLoading(true))
    getConnections()
      .then(({ data }) => {
        dispatch(setConnections(data))
      })
      .catch((err) => {
        dispatch(
          setConnectionsError(err instanceof Error ? err.message : 'Failed to load connections')
        )
      })
      .finally(() => {
        dispatch(setConnectionsLoading(false))
      })
  }, [user, dispatch, navigate])

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center safe-area-padding px-4 sm:px-6 py-6 sm:py-8">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="mt-4 text-base-content/70">Loading connections...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center safe-area-padding px-4 sm:px-6 py-6 sm:py-8">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center safe-area-padding px-4 sm:px-6 py-6 sm:py-8">
        <p className="text-base-content/70">No connections yet.</p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col bg-base-200 safe-area-padding">
      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-6">Connections</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {users.map((u) => (
            <div key={u._id} className="w-full max-w-[280px] mx-auto sm:max-w-none">
              <ProfileCard
                size="sm"
                displayName={userToDisplayName(u)}
                displayAgeGender={userToDisplayAgeGender(u) || undefined}
                avatarUrl={u.profilePicture?.trim() || DEFAULT_AVATAR}
                about={u.about}
                skills={u.skills}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
