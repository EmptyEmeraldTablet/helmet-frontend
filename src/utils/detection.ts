import type { Detection } from '@/types/detection'

export const normalizeLabel = (label: string) => {
  const key = label.toLowerCase()
  if (key === 'no_helmet' || key === 'head') return 'no_helmet'
  if (key === 'helmet' || key === 'vest') return key
  if (key === 'person') return 'person'
  if (key === 'none') return 'none'
  return key
}

const getSafetyCounts = (detections: Detection[] | null | undefined) => {
  const items = detections ?? []
  let helmetCount = 0
  let vestCount = 0
  for (const item of items) {
    const label = normalizeLabel(item.label)
    if (label === 'helmet') helmetCount += 1
    if (label === 'vest') vestCount += 1
  }
  return { helmetCount, vestCount, total: items.length }
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
  const { helmetCount, vestCount, total } = getSafetyCounts(detections)
  if (!total) return false
  return helmetCount === 0 || vestCount === 0
}

export const countMissingSafety = (detections: Detection[] | null | undefined): number => {
  const { helmetCount, vestCount, total } = getSafetyCounts(detections)
  if (!total) return 0
  return (helmetCount === 0 ? 1 : 0) + (vestCount === 0 ? 1 : 0)
}

export const safetyStatus = (detections: Detection[] | null | undefined): string => {
  const { helmetCount, vestCount, total } = getSafetyCounts(detections)
  if (!total) return '-'
  const helmetText = helmetCount > 0 ? `Yes (${helmetCount})` : 'No'
  const vestText = vestCount > 0 ? `Yes (${vestCount})` : 'No'
  return `Helmet: ${helmetText}, Vest: ${vestText}`
}
