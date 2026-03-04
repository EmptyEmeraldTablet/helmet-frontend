import axios from 'axios'
import router from '@/router'
import { clearToken, getToken } from '@/utils/token'

const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const apiBase = base.endsWith('/api') ? base : `${base}/api`

const http = axios.create({
  baseURL: apiBase,
  timeout: 15000,
})

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken()
      router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default http
