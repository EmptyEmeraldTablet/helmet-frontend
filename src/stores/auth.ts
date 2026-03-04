import { defineStore } from 'pinia'
import { login } from '@/api/auth'
import { clearToken, getToken, setToken } from '@/utils/token'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getToken() as string | null,
    username: '' as string,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    async login(username: string, password: string) {
      const response = await login({ username, password })
      this.token = response.data.access_token
      this.username = username
      setToken(this.token)
    },
    logout() {
      this.token = null
      this.username = ''
      clearToken()
      window.location.href = '/login'
    },
  },
})
