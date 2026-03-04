import http from './http'
import type { ApiResponse } from '@/types/api'
import type { LoginRequest, TokenResponse } from '@/types/auth'

export const login = async (payload: LoginRequest): Promise<ApiResponse<TokenResponse>> => {
  const response = await http.post<ApiResponse<TokenResponse>>('/auth/login', payload)
  return response.data
}
