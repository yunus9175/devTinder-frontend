import { DEFAULT_AVATAR, getProxiedFallback } from '../../lib/imageUtils'

export interface ProfileCardProps {
  displayName: string
  displayAgeGender?: string
  avatarUrl: string
  about?: string
  skills?: string[]
  onIgnore?: () => void
  onInterested?: () => void
  /** 'sm' = compact for feed; 'md' = default */
  size?: 'sm' | 'md'
  /** When true, image area grows to fill container (e.g. match form height on profile edit) */
  stretch?: boolean
  className?: string
  /** Controls action labels/styles (e.g. feed vs request cards). */
  variant?: 'default' | 'request'
  /** When true, disables both action buttons (e.g. while calling API). */
  actionsDisabled?: boolean
}

const SKILLS_VISIBLE = 3

export function ProfileCard({
  displayName,
  displayAgeGender,
  avatarUrl,
  about,
  skills = [],
  onIgnore,
  onInterested,
  size = 'md',
  stretch = false,
  className = '',
  variant = 'default',
  actionsDisabled = false,
}: ProfileCardProps) {
  const showActions = onIgnore !== undefined || onInterested !== undefined
  const skillsList = skills.slice(0, SKILLS_VISIBLE)
  const extraSkillsCount = skills.length - SKILLS_VISIBLE
  const isCompact = size === 'sm'
  const isRequestVariant = variant === 'request'

  const primaryLabel = isRequestVariant ? 'Reject' : 'Ignore'
  const secondaryLabel = isRequestVariant ? 'Accept' : 'Interested'

  const primaryButtonClass = `btn btn-outline ${isRequestVariant ? 'btn-error' : 'btn-primary'} flex-1 ${isCompact ? 'btn-xs' : 'btn-sm'
    }`
  const secondaryButtonClass = `btn ${isRequestVariant ? 'btn-success' : 'btn-primary'} flex-1 ${isCompact ? 'btn-xs' : 'btn-sm'
    }`

  const figureClass = stretch
    ? 'relative w-full flex-1 min-h-48 shrink-0 bg-base-300 overflow-hidden'
    : isCompact
      ? 'relative w-full aspect-[4/3] min-h-30 sm:min-h-40 shrink-0 bg-base-300 overflow-hidden'
      : 'relative w-full aspect-[3/4] min-h-56 sm:min-h-64 shrink-0 bg-base-300 overflow-hidden'

  return (
    <div className={`card bg-base-100 shadow-xl border border-base-300 overflow-hidden flex-1 flex flex-col min-h-0 ${className}`.trim()}>
      {/* Standard card image: fixed aspect container + object-cover + object-top so faces stay in frame */}
      <figure className={figureClass}>
        <img
          src={avatarUrl}
          alt={displayName}
          className="block w-full h-full object-fill object-center"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const img = e.target as HTMLImageElement
            const proxied = getProxiedFallback(img.src)
            if (proxied && img.src !== proxied) img.src = proxied
            else img.src = DEFAULT_AVATAR
          }}
        />
      </figure>
      <div className={`card-body shrink-0 grow-0 ${isCompact ? 'p-3' : 'p-4 sm:p-5'}`}>
        <h2 className={`card-title text-base-content ${isCompact ? 'text-base' : 'text-lg'}`}>{displayName}</h2>
        {displayAgeGender && <span className="text-sm text-base-content/70">{displayAgeGender}</span>}
        {about?.trim() && (
          <span className="text-sm text-base-content/80 mt-2 line-clamp-2 block">{about.trim()}</span>
        )}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {skillsList.map((skill) => (
              <span key={skill} className="badge badge-outline badge-sm">
                {skill}
              </span>
            ))}
            {extraSkillsCount > 0 && (
              <span className="badge badge-ghost badge-sm">+{extraSkillsCount}</span>
            )}
          </div>
        )}
        {showActions && (
          <div
            className={`card-actions justify-center gap-2 border-t border-base-300 ${isCompact ? 'mt-2 pt-2' : 'mt-4 pt-4'}`}
          >
            <button
              type="button"
              className={primaryButtonClass}
              disabled={actionsDisabled || !onIgnore}
              onClick={onIgnore}
            >
              {primaryLabel}
            </button>
            <button
              type="button"
              className={secondaryButtonClass}
              disabled={actionsDisabled || !onInterested}
              onClick={onInterested}
            >
              {secondaryLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
