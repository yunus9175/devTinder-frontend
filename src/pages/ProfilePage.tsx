import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateProfile } from '../api/auth.ts'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { ROUTES } from '../constants/index.ts'
import { useAppDispatch, useAppSelector } from '../store/index.ts'
import { setCredentials } from '../store/slices/authSlice'
import { DEFAULT_AVATAR, getProxiedFallback } from '../lib/imageUtils'
import { validateProfileFields } from '../lib/validation.ts'
import type { UpdateProfilePayload } from '../types/auth.ts'

export function Profile() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, sessionRestoring } = useAppSelector((state) => state.auth)
  const [formData, setFormData] = useState<UpdateProfilePayload & { skillsInput: string; ageInput: string }>({
    firstName: '',
    lastName: '',
    email: '',
    ageInput: '',
    gender: '',
    profilePicture: '',
    about: '',
    skills: [],
    skillsInput: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  /** Normalize gender from API (e.g. "male") to match dropdown option (e.g. "Male"). */
  const normalizeGender = (g: string | undefined): string => {
    if (!g?.trim()) return ''
    const s = g.trim().toLowerCase()
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  useEffect(() => {
    if (sessionRestoring) return
    if (!user) {
      navigate(ROUTES.LOGIN, { replace: true })
      return
    }
    setFormData({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      ageInput: user.age != null ? String(user.age) : '',
      gender: normalizeGender(user.gender),
      profilePicture: user.profilePicture ?? '',
      about: user.about ?? '',
      skills: user.skills ?? [],
      skillsInput: (user.skills ?? []).join(', '),
    })
  }, [user, sessionRestoring, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'skillsInput') {
      const skills = value.split(',').map((s) => s.trim()).filter(Boolean)
      setFormData((prev) => ({ ...prev, skillsInput: value, skills }))
    } else if (name === 'ageInput') {
      setFormData((prev) => ({ ...prev, ageInput: value }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (submitError) setSubmitError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ageInputTrimmed = formData.ageInput.trim()
    const ageNum = ageInputTrimmed ? parseInt(formData.ageInput, 10) : undefined
    const payload: UpdateProfilePayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      ...(ageInputTrimmed !== '' && { age: ageNum }),
      ...(formData.gender !== undefined && { gender: formData.gender.trim().toLowerCase() || undefined }),
      profilePicture: formData.profilePicture?.trim() || undefined,
      about: formData.about?.trim() || undefined,
      skills: formData.skills?.map((s) => s.trim().toLowerCase()) || [],
    }
    const { valid, errors: fieldErrors } = validateProfileFields(payload)
    if (!valid) {
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setSubmitError(null)
    setLoading(true)
    try {
      const { user: updatedUser } = await updateProfile(payload)
      dispatch(setCredentials(updatedUser))
      setShowSuccessToast(true)
      setIsEditing(false)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!showSuccessToast) return
    const t = setTimeout(() => setShowSuccessToast(false), 3000)
    return () => clearTimeout(t)
  }, [showSuccessToast])

  if (sessionRestoring) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center safe-area-padding px-4">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="mt-4 text-base-content/70">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const displayName = [formData.firstName.trim(), formData.lastName.trim()].filter(Boolean).join(' ') || 'Your name'
  const displayAgeGender = [formData.ageInput.trim(), formData.gender?.trim()].filter(Boolean).join(', ') || 'Age, gender'
  const previewAvatar = formData.profilePicture?.trim() || DEFAULT_AVATAR
  const proxiedAvatar = getProxiedFallback(previewAvatar)
  const connectionCounts = user.connectionCounts
  const pendingIncoming = connectionCounts?.pendingIncoming ?? 0
  const acceptedConnections = connectionCounts?.accepted ?? 0

  return (
    <div className="min-h-dvh flex flex-col bg-base-200 safe-area-padding">
      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
        {/* Back + title pinned to top-left */}
        <section className="w-full max-w-5xl mx-auto mb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-ghost btn-circle btn-sm"
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xl sm:text-2xl font-semibold text-base-content">
              Profile details
            </h2>
            {isEditing && (
              <span className="badge badge-primary/80 text-xs">Editing</span>
            )}
          </div>
        </section>

        {/* Modern profile header – mobile & desktop */}
        <section className="w-full max-w-5xl mx-auto mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-base-100 shadow-xl border border-base-300">
            {/* Cover / banner */}
            <div className="h-28 sm:h-32 bg-linear-to-r from-primary/80 via-secondary/60 to-primary/80" />
            {/* Avatar overlapping banner / content */}
            <div className="px-5 sm:px-8 pb-6">
              <div className="flex flex-col items-center sm:items-start -mt-12">
                <div className="avatar mb-3 relative inline-block">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring ring-base-100 ring-offset-[3px] ring-offset-base-100 border-4 border-base-100 overflow-hidden shadow-lg">
                    <img
                      src={previewAvatar}
                      alt={displayName}
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement
                        if (proxiedAvatar && img.src !== proxiedAvatar) {
                          img.src = proxiedAvatar
                        } else {
                          img.src = DEFAULT_AVATAR
                        }
                      }}
                    />
                  </div>
                  {user.isPremium && (
                    <span
                      className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1DA1F2] flex items-center justify-center border-2 border-base-100 shrink-0 shadow"
                      title="Premium"
                      aria-label="Premium member"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-base-content text-center sm:text-left w-full">
                  {displayName}
                </h1>
                <p className="text-sm text-base-content/70 mt-1 text-center sm:text-left w-full">
                  {formData.email || user.email}
                </p>
                {displayAgeGender !== 'Age, gender' && (
                  <p className="mt-1 text-sm text-base-content/70 text-center sm:text-left w-full">
                    {displayAgeGender}
                  </p>
                )}
                {formData.about?.trim() && (
                  <p className="mt-3 text-sm text-base-content/80 max-w-xl text-center sm:text-left w-full mx-auto sm:mx-0">
                    {formData.about.trim()}
                  </p>
                )}
                {/* Edit button + connection stats */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 w-full">
                  <Button
                    type="button"
                    className="btn-sm px-5 bg-linear-to-r from-primary to-secondary border-none shadow-md hover:brightness-110"
                    onClick={() => setIsEditing((prev) => !prev)}
                  >
                    {isEditing ? 'Cancel editing' : 'Edit profile'}
                  </Button>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-auto text-xs sm:text-sm">
                    <div className="badge badge-lg gap-2 rounded-full bg-warning/15 text-warning px-3 py-1 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-warning" />
                      <span className="uppercase tracking-wide">Pending</span>
                      <span className="text-base-content/80">{pendingIncoming}</span>
                    </div>
                    <div className="badge badge-lg gap-2 rounded-full bg-success/15 text-success px-3 py-1 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-success" />
                      <span className="uppercase tracking-wide">Accepted</span>
                      <span className="text-base-content/80">{acceptedConnections}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full max-w-5xl mx-auto">
          {/* Edit form */}
          <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-5">
              {submitError && (
                <div
                  className="rounded-xl px-4 py-3 text-sm bg-error/10 text-error border border-error/20"
                  role="alert"
                >
                  {submitError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="profile-firstName"
                  type="text"
                  name="firstName"
                  label="First name"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  disabled={!isEditing}
                  autoComplete="given-name"
                  minLength={3}
                  maxLength={50}
                  className="input-md"
                />
                <Input
                  id="profile-lastName"
                  type="text"
                  name="lastName"
                  label="Last name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  disabled={!isEditing}
                  autoComplete="family-name"
                  minLength={3}
                  maxLength={50}
                  className="input-md"
                />
              </div>
              <Input
                id="profile-email"
                type="email"
                name="email"
                label="Email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                disabled={!isEditing}
                autoComplete="email"
                className="input-md"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="profile-age"
                  type="number"
                  name="ageInput"
                  label="Age"
                  placeholder="25"
                  value={formData.ageInput}
                  onChange={handleChange}
                  error={errors.age}
                  disabled={!isEditing}
                  min={18}
                  max={120}
                  className="input-md"
                />
                <div className="form-control w-full">
                  <label htmlFor="profile-gender" className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    id="profile-gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="select select-bordered w-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <Input
                id="profile-profilePicture"
                type="url"
                name="profilePicture"
                label="Profile picture (URL)"
                placeholder="https://example.com/avatar.png"
                value={formData.profilePicture}
                onChange={handleChange}
                error={errors.profilePicture}
                disabled={!isEditing}
                className="input-md"
              />
              <div className="form-control w-full">
                <label htmlFor="profile-about" className="label">
                  <span className="label-text">About</span>
                </label>
                <textarea
                  id="profile-about"
                  name="about"
                  placeholder="A short bio..."
                  value={formData.about}
                  onChange={handleChange}
                  rows={3}
                  className="textarea textarea-bordered w-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
                  disabled={!isEditing}
                />
              </div>
              <Input
                id="profile-skills"
                type="text"
                name="skillsInput"
                label="Skills (comma-separated)"
                placeholder="React, Node.js, TypeScript"
                value={formData.skillsInput}
                onChange={handleChange}
                disabled={!isEditing}
                className="input-md"
              />
              {isEditing && (
                <Button type="submit" fullWidth loading={loading} className="btn-lg">
                  Save profile
                </Button>
              )}
            </form>
          </div>

        </div>
      </main>

      {showSuccessToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </div>
  )
}
