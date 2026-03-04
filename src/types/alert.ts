export type AlertResponse = {
  id: string
  task_id: string
  device_id: string
  violation_count: number
  is_read: boolean
  created_at: string
}

export type AlertListResponse = {
  total: number
  items: AlertResponse[]
}
