import { useState } from 'react'
import type { InputHTMLAttributes } from 'react'

/** DaisyUI-styled input (form-control, label, input, input-bordered, input-error). Use this for all text/email/password fields. DaisyUI is a Tailwind plugin and does not export React components. */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  id: string
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  )
}

function EyeSlashIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
}

export function Input({ label, error, id, className = '', type, ...props }: InputProps) {
  const isPassword = type === 'password'
  const [showPassword, setShowPassword] = useState(false)

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type
  const inputClass = `input input-bordered w-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0 ${error ? 'input-error' : ''} ${isPassword ? 'pr-12' : ''} ${className}`

  return (
    <div className="form-control w-full">
      <label htmlFor={id} className="label">
        <span className="label-text">{label}</span>
      </label>
      {isPassword ? (
        <div className="relative">
          <input
            id={id}
            type={inputType}
            className={inputClass}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
          />
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-circle absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeSlashIcon className="size-5" />
            ) : (
              <EyeIcon className="size-5" />
            )}
          </button>
        </div>
      ) : (
        <input
          id={id}
          type={type}
          className={inputClass}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      )}
      {error && (
        <label id={`${id}-error`} className="label" htmlFor={id}>
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  )
}
