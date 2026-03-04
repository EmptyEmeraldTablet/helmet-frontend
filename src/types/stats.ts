export type SummaryStats = {
  total_today: number
  violations_today: number
  violation_rate: number
  active_devices: number
}

export type TrendPoint = {
  bucket: string
  count: number
}

export type TrendResponse = {
  granularity: 'hour' | 'day' | 'week'
  points: TrendPoint[]
}

export type DeviceStats = {
  device_id: string
  count: number
}

export type DeviceStatsResponse = {
  items: DeviceStats[]
}
