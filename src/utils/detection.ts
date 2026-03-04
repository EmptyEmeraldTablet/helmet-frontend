import type { Detection } from '@/types/detection'

export const normalizeLabel = (label: string) => {
  const key = label.toLowerCase()
  if (key === 'no_helmet' || key === 'head') return 'head'
  if (key === 'helmet') return 'helmet'
  if (key === 'person' || key === 'none') return 'none'
  return label
}

export const summarizeLabels = (detections: Detection[] | null | undefined): string => {
  const items = detections ?? []
  if (!items.length) return 'None'
  const counts = new Map<string, number>()
  for (const item of items) {
    const label = normalizeLabel(item.label)
    counts.set(label, (counts.get(label) || 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([label, count]) => `${label} x${count}`)
    .join(', ')
}

export const hasViolation = (detections: Detection[] | null | undefined): boolean => {
  const items = detections ?? []
  return items.some((item) => {
    const label = normalizeLabel(item.label)
    return label === 'head' || label === 'none'
  })
}

export const countNoHelmet = (detections: Detection[] | null | undefined): number => {
  const items = detections ?? []
  return items.reduce((total, item) => {
    const label = normalizeLabel(item.label)
    if (label === 'head' || label === 'none') return total + 1
    return total
  }, 0)
}

export const helmetStatus = (detections: Detection[] | null | undefined): string => {
  const items = detections ?? []
  if (!items.length) return '-'
  const counts = new Map<string, number>()
  for (const item of items) {
    const label = normalizeLabel(item.label)
    counts.set(label, (counts.get(label) || 0) + 1)
  }
  const helmetCount = counts.get('helmet') || 0
  const noHelmetCount = (counts.get('head') || 0) + (counts.get('none') || 0)
  if (helmetCount > 0 && noHelmetCount === 0) return `Yes (${helmetCount})`
  if (helmetCount === 0 && noHelmetCount > 0) return `No (${noHelmetCount})`
  if (helmetCount > 0 && noHelmetCount > 0) {
    return `Mixed (helmet ${helmetCount} / no-helmet ${noHelmetCount})`
  }
  return 'Unknown'
}
