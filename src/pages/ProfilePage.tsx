import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateProfile } from '../api/auth.ts'
import { ProfileCard } from '../components/profile/ProfileCard.tsx'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { ROUTES } from '../constants/index.ts'
import { useAppDispatch, useAppSelector } from '../store/index.ts'
import { setCredentials } from '../store/slices/authSlice'
import { validateProfileFields } from '../lib/validation.ts'
import type { UpdateProfilePayload } from '../types/auth.ts'

const DEFAULT_AVATAR = 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'

export function Profile() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
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

  /** Normalize gender from API (e.g. "male") to match dropdown option (e.g. "Male"). */
  const normalizeGender = (g: string | undefined): string => {
    if (!g?.trim()) return ''
    const s = g.trim().toLowerCase()
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  useEffect(() => {
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
  }, [user, navigate])

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

  if (!user) {
    return null
  }

  const displayName = [formData.firstName.trim(), formData.lastName.trim()].filter(Boolean).join(' ') || 'Your name'
  const displayAgeGender = [formData.ageInput.trim(), formData.gender?.trim()].filter(Boolean).join(', ') || 'Age, gender'
  const previewAvatar = formData.profilePicture?.trim() || DEFAULT_AVATAR

  return (
    <div className="min-h-dvh flex flex-col bg-base-200 safe-area-padding">
      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-10 items-center lg:items-stretch">
          {/* Edit form */}
          <div className="w-full max-w-lg shrink-0">
            <div className="flex items-center gap-3 mb-6">
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
              <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Edit profile</h1>
            </div>
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
                className="input-md"
              />
              <Button type="submit" fullWidth loading={loading} className="btn-lg">
                Save profile
              </Button>
            </form>
          </div>

          {/* Live preview – how your profile looks to others */}
          <div className="w-full max-w-lg lg:sticky lg:top-6 shrink-0 flex flex-col min-h-0">
            <ProfileCard
              stretch
              displayName={displayName}
              displayAgeGender={displayAgeGender}
              avatarUrl={previewAvatar}
              about={formData.about}
              skills={formData.skills ?? []}
              className="flex-1 flex flex-col min-h-0"
            />
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
