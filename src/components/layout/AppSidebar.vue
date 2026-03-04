<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const active = computed(() => route.path)

const handleSelect = (index: string) => {
  if (index !== route.path) {
    router.push(index)
  }
}
</script>

<template>
  <aside class="app-sidebar">
    <div class="brand">Helmet<span>Ops</span></div>
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
      <span class="status-dot"></span>
      <span style="font-size: 12px; color: var(--color-muted);">Server online</span>
    </div>
    <el-menu :default-active="active" class="el-menu-vertical" @select="handleSelect">
      <el-menu-item index="/monitor">Monitor</el-menu-item>
      <el-menu-item index="/history">History</el-menu-item>
      <el-menu-item index="/alerts">Alerts</el-menu-item>
      <el-menu-item index="/stats">Stats</el-menu-item>
      <el-menu-item index="/devices">Devices</el-menu-item>
      <el-menu-item index="/settings">Settings</el-menu-item>
    </el-menu>
  </aside>
</template>

<style scoped>
.el-menu-vertical {
  border-right: none;
  background: transparent;
}
</style>
