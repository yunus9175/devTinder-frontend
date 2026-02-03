import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../api/auth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { AuthLayout } from '../components/layout/AuthLayout'
import { ROUTES } from '../constants'
import { validateSignupFields } from '../lib/validation'
import type { SignupPayload } from '../types/auth'
import { useAppDispatch, useAppSelector } from '../store'
import { setCredentials } from '../store/slices/authSlice'

export function Signup() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [formData, setFormData] = useState<SignupPayload>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (submitError) setSubmitError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { valid, errors: fieldErrors } = validateSignupFields(formData)
    if (!valid) {
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setSubmitError(null)
    setLoading(true)
    try {
      const { user } = await signup(formData)
      dispatch(setCredentials(user))
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join DevTinder and connect with developers"
      alternateLabel="Already have an account?"
      alternateTo={ROUTES.LOGIN}
    >
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {submitError && (
          <div
            className="rounded-xl px-4 py-3 text-sm bg-error/10 text-error border border-error/20"
            role="alert"
          >
            {submitError}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <Input
            id="signup-firstName"
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
            autoFocus
            className="input-md"
          />
          <Input
            id="signup-lastName"
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
          id="signup-email"
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
        <div>
          <Input
            id="signup-password"
            type="password"
            name="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
            className="input-md"
          />
          <p className="mt-2 text-xs text-base-content/60">
            At least 8 characters with uppercase, lowercase, number and symbol
          </p>
        </div>
        <Button type="submit" fullWidth loading={loading} className="btn-lg">
          Create account
        </Button>
      </form>
    </AuthLayout>
  )
}
