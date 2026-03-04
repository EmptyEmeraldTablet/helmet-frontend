import http from './http'
import type { ApiResponse } from '@/types/api'
import type { DeviceStatsResponse, SummaryStats, TrendResponse } from '@/types/stats'

export const fetchSummaryStats = async (): Promise<ApiResponse<SummaryStats>> => {
  const response = await http.get<ApiResponse<SummaryStats>>('/stats/summary')
  return response.data
}

export const fetchTrendStats = async (params: {
  granularity: 'hour' | 'day' | 'week'
  start_time?: string
  end_time?: string
  device_id?: string
}): Promise<ApiResponse<TrendResponse>> => {
  const response = await http.get<ApiResponse<TrendResponse>>('/stats/trend', { params })
  return response.data
}

export const fetchDeviceStats = async (): Promise<ApiResponse<DeviceStatsResponse>> => {
  const response = await http.get<ApiResponse<DeviceStatsResponse>>('/stats/devices')
  return response.data
}
