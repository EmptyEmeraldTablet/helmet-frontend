import http from './http'
import type { ApiResponse } from '@/types/api'
import type { AlertListResponse, AlertResponse } from '@/types/alert'

export const fetchAlerts = async (page = 1, pageSize = 20): Promise<ApiResponse<AlertListResponse>> => {
  const response = await http.get<ApiResponse<AlertListResponse>>('/alerts', {
    params: { page, page_size: pageSize },
  })
  return response.data
}

export const markAlertRead = async (alertId: string): Promise<ApiResponse<AlertResponse>> => {
  const response = await http.put<ApiResponse<AlertResponse>>(`/alerts/${alertId}/read`)
  return response.data
}

export const markAllRead = async (): Promise<ApiResponse<{ updated: number }>> => {
  const response = await http.put<ApiResponse<{ updated: number }>>('/alerts/read-all')
  return response.data
}
