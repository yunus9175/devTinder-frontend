import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getReceivedRequests } from '../api/auth'
import { ProfileCard } from '../components/profile'
import { ROUTES } from '../constants'
import { useAppDispatch, useAppSelector } from '../store'
import { setRequests, setRequestsError, setRequestsLoading } from '../store/slices/requestsSlice'
import type { ConnectionRequest, User } from '../types/auth'

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

export function Requests() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { items, loading, error } = useAppSelector((state) => state.requests)

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN, { replace: true })
      return
    }
    dispatch(setRequestsLoading(true))
    getReceivedRequests()
      .then(({ data }) => {
        dispatch(setRequests(data))
      })
      .catch((err) => {
        dispatch(
          setRequestsError(err instanceof Error ? err.message : 'Failed to load requests'),
        )
      })
      .finally(() => {
        dispatch(setRequestsLoading(false))
      })
  }, [user, dispatch, navigate])

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center safe-area-padding px-4 sm:px-6 py-6 sm:py-8">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="mt-4 text-base-content/70">Loading requests...</p>
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

  if (items.length === 0) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center safe-area-padding px-4 sm:px-6 py-6 sm:py-8">
        <p className="text-base-content/70">No pending requests.</p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col bg-base-200 safe-area-padding">
      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-6">Requests</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((req: ConnectionRequest) => {
            const from = req.fromUserId
            return (
              <div key={req._id} className="w-full max-w-[280px] mx-auto sm:max-w-none">
                <ProfileCard
                  size="sm"
                  variant="request"
                  displayName={userToDisplayName(from)}
                  displayAgeGender={userToDisplayAgeGender(from) || undefined}
                  avatarUrl={from.profilePicture?.trim() || DEFAULT_AVATAR}
                  about={from.about}
                  skills={from.skills}
                  onIgnore={() => {
                    // TODO: wire up reject API
                    // eslint-disable-next-line no-console
                    console.log('Reject request', req._id)
                  }}
                  onInterested={() => {
                    // TODO: wire up accept API
                    // eslint-disable-next-line no-console
                    console.log('Accept request', req._id)
                  }}
                />
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

