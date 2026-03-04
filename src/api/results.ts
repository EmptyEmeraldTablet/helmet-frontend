import http from './http'
import type { ApiResponse } from '@/types/api'
import type { ResultDetail, ResultListResponse } from '@/types/result'

export const fetchResults = async (params: {
  page: number
  page_size: number
  device_id?: string
  has_violation?: boolean
  start_time?: string
  end_time?: string
}): Promise<ApiResponse<ResultListResponse>> => {
  const response = await http.get<ApiResponse<ResultListResponse>>('/results', { params })
  return response.data
}

export const fetchResultDetail = async (taskId: string): Promise<ApiResponse<ResultDetail>> => {
  const response = await http.get<ApiResponse<ResultDetail>>(`/results/${taskId}`)
  return response.data
}
