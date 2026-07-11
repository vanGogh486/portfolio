/**
 * Resolve a public asset path using Vite's BASE_URL.
 * In dev (BASE_URL="/"): returns path unchanged
 * In prod (BASE_URL="/portfolio/"): prepends /portfolio/
 */
export function publicAsset(path: string | undefined | null): string {
  if (!path) return ''

  // Don't touch external URLs or data URIs
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path
  }

  const normalized = path.replace(/^\/+/, '')
  return `${import.meta.env.BASE_URL}${normalized}`
}
