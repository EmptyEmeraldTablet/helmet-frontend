<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const username = computed(() => auth.username || 'admin')

const handleLogout = () => {
  auth.logout()
}
</script>

<template>
  <header class="app-header">
    <div>
      <div class="page-title">Safety Helmet Monitor</div>
      <div class="page-subtitle">Realtime detection and compliance management</div>
    </div>
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="font-family: 'Fira Mono', monospace; font-size: 12px; color: var(--color-muted);">
        {{ username }}
      </div>
      <el-button type="primary" plain @click="handleLogout">Log out</el-button>
    </div>
  </header>
</template>
