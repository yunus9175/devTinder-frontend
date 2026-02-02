import type { ButtonHTMLAttributes } from 'react'

/** DaisyUI-only button: btn, btn-primary/secondary/ghost, btn-block, loading, loading-spinner. See https://daisyui.com/components/button/ */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  const variantClass =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'secondary'
        ? 'btn-secondary'
        : 'btn-ghost'

  return (
    <button
      type={type}
      className={`btn min-h-12 touch-manipulation ${variantClass} ${fullWidth ? 'btn-block' : ''} ${className}`}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="loading loading-spinner loading-sm" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
