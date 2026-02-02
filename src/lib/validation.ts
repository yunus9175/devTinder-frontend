/**
 * Client-side validation matching devtinder-backend (validator.isEmail, validator.isStrongPassword).
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** At least 8 chars, 1 lowercase, 1 uppercase, 1 number, 1 symbol (matches validator.isStrongPassword default) */
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export function isEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim())
}

export function isStrongPassword(value: string): boolean {
  return STRONG_PASSWORD_REGEX.test(value)
}

export function validateSignupFields(payload: {
  firstName: string
  lastName: string
  email: string
  password: string
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  const firstName = payload.firstName.trim()
  const lastName = payload.lastName.trim()
  const email = payload.email.trim().toLowerCase()
  const { password } = payload

  if (!firstName || firstName.length < 3 || firstName.length > 50) {
    errors.firstName = 'First name must be between 3 and 50 characters'
  }
  if (!lastName || lastName.length < 3 || lastName.length > 50) {
    errors.lastName = 'Last name must be between 3 and 50 characters'
  }
  if (!email) {
    errors.email = 'Email is required'
  } else if (!isEmail(payload.email)) {
    errors.email = 'Please enter a valid email address'
  }
  if (!password) {
    errors.password = 'Password is required'
  } else if (!isStrongPassword(password)) {
    errors.password =
      'Password must be at least 8 characters with uppercase, lowercase, number and symbol'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateLoginFields(payload: {
  email: string
  password: string
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  const email = payload.email.trim()

  if (!email) {
    errors.email = 'Email is required'
  } else if (!isEmail(payload.email)) {
    errors.email = 'Please enter a valid email address'
  }
  if (!payload.password) {
    errors.password = 'Password is required'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
