import type { Detection } from './detection'

export type ResultItem = {
  task_id: string
  device_id: string
  created_at: string
  annotated_image_url: string | null
  detections: Detection[]
  has_violation: boolean
}

export type ResultListResponse = {
  total: number
  items: ResultItem[]
}

export type ResultDetail = ResultItem & {
  original_image_url: string | null
  process_time_ms: number | null
}
