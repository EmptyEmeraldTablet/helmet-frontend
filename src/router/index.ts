import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import MonitorView from '@/views/MonitorView.vue'
import HistoryView from '@/views/HistoryView.vue'
import AlertView from '@/views/AlertView.vue'
import StatsView from '@/views/StatsView.vue'
import DeviceView from '@/views/DeviceView.vue'
import SettingsView from '@/views/SettingsView.vue'
import { getToken } from '@/utils/token'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/monitor',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true, layout: 'empty' },
    },
    {
      path: '/monitor',
      name: 'monitor',
      component: MonitorView,
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView,
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: AlertView,
    },
    {
      path: '/stats',
      name: 'stats',
      component: StatsView,
    },
    {
      path: '/devices',
      name: 'devices',
      component: DeviceView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.public) {
    return true
  }
  if (getToken()) {
    return true
  }
  return { path: '/login', query: { redirect: to.fullPath } }
})

export default router
