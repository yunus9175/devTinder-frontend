/**
 * Default avatar URL when user has no profile picture or when image fails to load.
 */
export const DEFAULT_AVATAR =
  'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'

/**
 * Returns a public image-proxy URL for the given image URL.
 * Use as fallback when external URLs (e.g. LinkedIn) fail to load in some browsers (e.g. Brave).
 * The proxy (images.weserv.nl) fetches the image server-side and serves it, avoiding
 * referrer/blocking issues.
 */
export function proxyImageUrl(url: string): string {
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`
}

/**
 * If the URL is an external HTTP(S) URL and not already the default avatar,
 * returns the proxied version for use as a fallback on load error. Otherwise returns null.
 */
export function getProxiedFallback(url: string): string | null {
  if (!url || !url.startsWith('http') || url === DEFAULT_AVATAR) return null
  return proxyImageUrl(url)
}

