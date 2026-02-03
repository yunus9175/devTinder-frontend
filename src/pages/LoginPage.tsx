import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { AuthLayout } from '../components/layout/AuthLayout'
import { ROUTES } from '../constants'
import { validateLoginFields } from '../lib/validation'
import type { LoginPayload } from '../types/auth'
import { useAppDispatch, useAppSelector } from '../store'
import { setCredentials } from '../store/slices/authSlice'

export function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [formData, setFormData] = useState<LoginPayload>({ email: '', password: '' })
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
    const { valid, errors: fieldErrors } = validateLoginFields(formData)
    if (!valid) {
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setSubmitError(null)
    setLoading(true)
    try {
      const { user } = await login(formData)
      dispatch(setCredentials(user))
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to connect with developers"
      alternateLabel="Don't have an account?"
      alternateTo={ROUTES.SIGNUP}
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
        <Input
          id="login-email"
          type="email"
          name="email"
          label="Email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          autoFocus
          className="input-md"
        />
        <div>
          <Input
            id="login-password"
            type="password"
            name="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
            className="input-md"
          />
          {/* Placeholder for future forgot password */}
          <p className="mt-2 text-right">
            <button
              type="button"
              className="link link-hover text-sm text-base-content/60"
            >
              Forgot password?
            </button>
          </p>
        </div>
        <Button type="submit" fullWidth loading={loading} className="btn-lg">
          Log in
        </Button>
      </form>
    </AuthLayout>
  )
}
