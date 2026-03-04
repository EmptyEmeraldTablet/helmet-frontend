import http from './http'
import type { ApiResponse } from '@/types/api'
import type {
  Device,
  DeviceCreateRequest,
  DeviceCreateResponse,
  DeviceUpdateRequest,
} from '@/types/device'

export const fetchDevices = async (): Promise<ApiResponse<Device[]>> => {
  const response = await http.get<ApiResponse<Device[]>>('/devices')
  return response.data
}

export const createDevice = async (
  payload: DeviceCreateRequest,
): Promise<ApiResponse<DeviceCreateResponse>> => {
  const response = await http.post<ApiResponse<DeviceCreateResponse>>('/devices', payload)
  return response.data
}

export const updateDevice = async (
  deviceId: string,
  payload: DeviceUpdateRequest,
): Promise<ApiResponse<Device>> => {
  const response = await http.put<ApiResponse<Device>>(`/devices/${deviceId}`, payload)
  return response.data
}

export const disableDevice = async (deviceId: string): Promise<ApiResponse<Device>> => {
  const response = await http.delete<ApiResponse<Device>>(`/devices/${deviceId}`)
  return response.data
}

export const regenerateDeviceKey = async (
  deviceId: string,
): Promise<ApiResponse<DeviceCreateResponse>> => {
  const response = await http.post<ApiResponse<DeviceCreateResponse>>(
    `/devices/${deviceId}/regenerate-key`,
  )
  return response.data
}
