/** Full-page loading fallback for Suspense (DaisyUI loading spinner). */
export function PageLoader() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-base-100">
      <span className="loading loading-spinner loading-lg text-primary" aria-label="Loading" />
    </div>
  )
}
