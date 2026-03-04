import http from './http'
import type { ApiResponse } from '@/types/api'
import type { SystemConfigResponse, SystemConfigUpdate } from '@/types/settings'

export const fetchSettings = async (): Promise<ApiResponse<SystemConfigResponse>> => {
  const response = await http.get<ApiResponse<SystemConfigResponse>>('/settings')
  return response.data
}

export const updateSettings = async (
  payload: SystemConfigUpdate,
): Promise<ApiResponse<SystemConfigResponse>> => {
  const response = await http.put<ApiResponse<SystemConfigResponse>>('/settings', payload)
  return response.data
}
