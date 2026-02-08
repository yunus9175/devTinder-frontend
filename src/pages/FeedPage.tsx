import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFeed, sendIgnoredRequest, sendInterestedRequest } from '../api/auth'
import { ProfileCard } from '../components/profile'
import { ROUTES } from '../constants'
import { useAppDispatch, useAppSelector } from '../store'
import { appendFeed, popFeedUser, setFeed, setFeedError, setFeedLoading } from '../store/slices/feedSlice'
import { DEFAULT_AVATAR } from '../lib/imageUtils'
import type { User } from '../types/auth'

function userToDisplayName(u: User): string {
  return [u.firstName?.trim(), u.lastName?.trim()].filter(Boolean).join(' ') || 'Unknown'
}

function userToDisplayAgeGender(u: User): string {
  const parts: string[] = []
  if (u.age != null && u.age > 0) parts.push(String(u.age))
  if (u.gender?.trim()) parts.push(u.gender.trim())
  return parts.join(', ') || ''
}

export function Feed() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { users, loading, error } = useAppSelector((state) => state.feed)
  const [isMobileLayout, setIsMobileLayout] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [fetchingMore, setFetchingMore] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [dragState, setDragState] = useState<{
    active: boolean
    startX: number
    startY: number
    x: number
    y: number
  }>({
    active: false,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
  })

  const initialFetchDone = useRef(false)

  const topUser = users[0]
  // Slightly lower threshold so swipes feel easier, especially on mobile.
  const swipeThreshold = 60

  const visibleUsers = useMemo(() => users.slice(0, 3), [users])

  // Detect mobile layout based on viewport width; used to disable drag and show tap buttons
  useEffect(() => {
    const update = () => {
      if (typeof window !== 'undefined') {
        setIsMobileLayout(window.innerWidth < 640)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Initial feed load: only when user is set and feed is empty. Ref guards against Strict Mode double-invoke in dev.
  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN, { replace: true })
      return
    }
    if (users.length > 0) return
    if (initialFetchDone.current) return
    initialFetchDone.current = true
    dispatch(setFeedLoading(true))
    setToast(null)
    getFeed(1)
      .then(({ data }) => {
        dispatch(setFeed(data))
        setPage(1)
        setHasMore(data.length > 0)
      })
      .catch((err) => {
        dispatch(setFeedError(err instanceof Error ? err.message : 'Failed to load feed'))
      })
      .finally(() => {
        dispatch(setFeedLoading(false))
      })
  }, [user, dispatch, navigate, users.length])

  // Prefetch next page only after initial load, when deck is getting low (avoid calling getFeed(2) on mount)
  useEffect(() => {
    if (!user) return
    if (users.length === 0) return
    if (!hasMore || fetchingMore || loading) return
    if (users.length > 3) return

    setFetchingMore(true)
    getFeed(page + 1)
      .then(({ data }) => {
        if (data.length === 0) {
          setHasMore(false)
          return
        }
        dispatch(appendFeed(data))
        setPage((prev) => prev + 1)
      })
      .catch((err) => {
        // Do not surface as main error; keep current deck usable
        // eslint-disable-next-line no-console
        console.error('Failed to load more feed users', err)
      })
      .finally(() => {
        setFetchingMore(false)
      })
  }, [user, users.length, hasMore, fetchingMore, loading, page, dispatch])

  // Auto-hide toast after a short delay
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const resetDrag = () => {
    setDragState({
      active: false,
      startX: 0,
      startY: 0,
      x: 0,
      y: 0,
    })
  }

  const handleReview = (direction: 'left' | 'right') => {
    const current = topUser
    if (!current || processingId) return

    setProcessingId(current._id)
    setToast(null)

    const apiCall =
      direction === 'right'
        ? sendInterestedRequest(current._id)
        : sendIgnoredRequest(current._id)

    apiCall
      .then(() => {
        dispatch(popFeedUser())
        setToast({
          type: 'success',
          message: direction === 'right' ? 'Marked as interested' : 'Ignored developer',
        })
      })
      .catch((err) => {
        setToast({
          type: 'error',
          message: err instanceof Error ? err.message : 'Failed to update preference',
        })
      })
      .finally(() => {
        setProcessingId(null)
        resetDrag()
      })
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Disable drag/swipe on mobile layout; only allow on larger screens
    if (isMobileLayout || !topUser || processingId) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragState({
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      x: 0,
      y: 0,
    })
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.active) return
    e.preventDefault()
    const x = e.clientX - dragState.startX
    const y = e.clientY - dragState.startY
    setDragState((prev) => ({
      ...prev,
      x,
      y,
    }))
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.active) return
    const x = e.clientX - dragState.startX
    if (x > swipeThreshold) {
      handleReview('right')
    } else if (x < -swipeThreshold) {
      handleReview('left')
    } else {
      resetDrag()
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center safe-area-padding px-4 sm:px-6 py-6 sm:py-8">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="mt-4 text-base-content/70">Loading feed...</p>
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
        <p className="text-base-content/70">No developers in your feed yet.</p>
      </div>
    )
  }

  const rootClassName = `min-h-[calc(100dvh-100px)] flex flex-col bg-base-200 safe-area-padding${dragState.active ? ' overflow-hidden' : ''
    }`

  return (
    <div className={rootClassName}>
      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-6">Feed</h1>
        <div className="relative w-full max-w-sm sm:max-w-md flex-1 flex flex-col items-center justify-center">
          {visibleUsers.map((u, index) => {
            const isTop = index === 0
            const offset = index
            const baseTransform = isTop
              ? `translateX(${dragState.x}px) translateY(${dragState.y}px) rotate(${dragState.x / 20}deg)`
              : `scale(${1 - offset * 0.04}) translateY(${offset * 12}px)`

            const opacityLabel = Math.min(Math.abs(dragState.x) / 120, 1)
            const showLike = isTop && dragState.x > 0
            const showNope = isTop && dragState.x < 0

            return (
              <div
                key={u._id}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: baseTransform,
                  transition:
                    dragState.active || processingId === u._id ? 'none' : 'transform 0.2s ease-out',
                  zIndex: 10 - index,
                }}
                onPointerDown={isTop ? handlePointerDown : undefined}
                onPointerMove={isTop ? handlePointerMove : undefined}
                onPointerUp={isTop ? handlePointerUp : undefined}
                onPointerCancel={isTop ? handlePointerUp : undefined}
              >
                <div className="relative w-full max-w-xs sm:max-w-sm">
                  <ProfileCard
                    size="sm"
                    displayName={userToDisplayName(u)}
                    displayAgeGender={userToDisplayAgeGender(u) || undefined}
                    avatarUrl={u.profilePicture?.trim() || DEFAULT_AVATAR}
                    about={u.about}
                    skills={u.skills}
                  />
                  {/* Mobile-only overlay buttons on image corners; drag only on larger screens */}
                  {isMobileLayout && isTop && (
                    <div className="absolute inset-x-0 top-3 flex items-center justify-between px-3 sm:hidden">
                      <button
                        type="button"
                        className="btn btn-circle btn-outline btn-error text-base shadow-lg"
                        disabled={!topUser || !!processingId}
                        onClick={() => handleReview('left')}
                      >
                        ✕
                      </button>
                      <button
                        type="button"
                        className="btn btn-circle btn-primary text-base shadow-lg"
                        disabled={!topUser || !!processingId}
                        onClick={() => handleReview('right')}
                      >
                        ❤
                      </button>
                    </div>
                  )}
                  {showLike && (
                    <div
                      className="absolute top-4 left-4 px-3 py-1 border-2 border-success text-success font-bold text-sm rounded-md bg-base-100/80"
                      style={{ opacity: opacityLabel }}
                    >
                      LIKE
                    </div>
                  )}
                  {showNope && (
                    <div
                      className="absolute top-4 right-4 px-3 py-1 border-2 border-error text-error font-bold text-sm rounded-md bg-base-100/80"
                      style={{ opacity: opacityLabel }}
                    >
                      NOPE
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        {/* Desktop / larger-screen controls under the card */}
        <div className="mt-6 hidden sm:flex items-center justify-center gap-4">
          <button
            type="button"
            className="btn btn-circle btn-outline btn-error text-xl"
            disabled={!topUser || !!processingId}
            onClick={() => handleReview('left')}
          >
            ✕
          </button>
          <button
            type="button"
            className="btn btn-circle btn-primary text-xl"
            disabled={!topUser || !!processingId}
            onClick={() => handleReview('right')}
          >
            ❤
          </button>
        </div>
        {fetchingMore && hasMore && (
          <p className="mt-4 text-sm text-base-content/60">Loading more developers...</p>
        )}
      </main>
      {toast && (
        <div className="toast toast-top toast-center  z-50">
          <div
            className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'
              }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
