const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const root = base.endsWith('/api') ? base.slice(0, -4) : base

export const resolveStorageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  if (path.startsWith('/storage')) {
    return root ? `${root}${path}` : path
  }
  return path
}
