<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useWebSocket } from '@/composables/useWebSocket'
import type { ResultItem } from '@/types/result'

const auth = useAuthStore()
const results = ref<ResultItem[]>([])
const alertCount = ref(0)

const wsUrl = computed(() => {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  const root = base.replace(/\/api$/, '')
  const wsBase = root.replace('https://', 'wss://').replace('http://', 'ws://')
  const trimmed = wsBase.replace(/\/$/, '')
  return `${trimmed}/ws/monitor?token=${auth.token}`
})

const { status, lastMessage, connect } = useWebSocket(wsUrl.value)

const statusLabel = computed(() => {
  if (status.value === 'open') return 'Connected'
  if (status.value === 'connecting') return 'Connecting'
  if (status.value === 'error') return 'Error'
  return 'Offline'
})

const handleMessage = (payload: any) => {
  if (payload.event === 'new_result') {
    const item: ResultItem = {
      task_id: payload.data.task_id,
      device_id: payload.data.device_id,
      created_at: payload.data.created_at,
      annotated_image_url: payload.data.annotated_image_url,
      detections: payload.data.detections || [],
      has_violation: payload.data.has_violation,
    }
    results.value = [item, ...results.value].slice(0, 12)
  }
  if (payload.event === 'alert') {
    alertCount.value += 1
  }
}

watch(lastMessage, (message) => {
  if (!message) return
  try {
    const payload = JSON.parse(message)
    handleMessage(payload)
  } catch (error) {
    ElMessage.warning('WebSocket payload error')
  }
})

onMounted(() => {
  if (auth.token) {
    connect()
  }
})
</script>

<template>
  <section class="panel">
    <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div class="page-title" style="font-size: 20px;">Realtime Monitor</div>
        <div class="page-subtitle">Live results from the inference queue</div>
      </div>
      <div style="display: flex; gap: 12px; align-items: center;">
        <el-tag type="success" v-if="status === 'open'">{{ statusLabel }}</el-tag>
        <el-tag type="warning" v-else>{{ statusLabel }}</el-tag>
        <span class="tag-violation">Alerts: {{ alertCount }}</span>
      </div>
    </div>
    <div class="panel-body">
      <div class="card-grid">
        <el-card
          v-for="item in results"
          :key="item.task_id"
          :class="item.has_violation ? 'violation-card' : ''"
        >
          <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600;">Device {{ item.device_id }}</span>
              <span v-if="item.has_violation" class="tag-violation">Violation</span>
            </div>
          </template>
          <div>
            <img
              v-if="item.annotated_image_url"
              :src="item.annotated_image_url"
              alt="annotated"
              style="width: 100%; border-radius: 10px; margin-bottom: 12px;"
            />
            <div style="font-size: 12px; color: var(--color-muted); margin-bottom: 8px;">
              {{ new Date(item.created_at).toLocaleString() }}
            </div>
            <div style="font-size: 13px;">
              Detections: {{ item.detections.length }}
            </div>
          </div>
        </el-card>
      </div>
      <div v-if="results.length === 0" style="margin-top: 16px; color: var(--color-muted);">
        Waiting for incoming results from WebSocket.
      </div>
    </div>
  </section>
</template>

<style scoped>
.violation-card {
  border: 1px solid rgba(180, 35, 24, 0.4);
  box-shadow: 0 10px 24px rgba(180, 35, 24, 0.15);
}
</style>
