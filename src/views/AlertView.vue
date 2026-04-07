<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchAlerts, markAlertRead, markAllRead } from '@/api/alerts'
import { fetchResultDetail } from '@/api/results'
import { countMissingSafety } from '@/utils/detection'
import type { AlertResponse } from '@/types/alert'

const alerts = ref<AlertResponse[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const loading = ref(false)
const violationCounts = ref<Record<string, number>>({})

const loadViolationCounts = async (items: AlertResponse[]) => {
  if (!items.length) {
    violationCounts.value = {}
    return
  }
  const entries = await Promise.all(
    items.map(async (item) => {
      try {
        const response = await fetchResultDetail(item.task_id)
        return [item.id, countMissingSafety(response.data.detections)]
      } catch (error) {
        return [item.id, item.violation_count]
      }
    }),
  )
  violationCounts.value = Object.fromEntries(entries)
}

const getViolationCount = (item: AlertResponse) =>
  violationCounts.value[item.id] ?? item.violation_count

const loadAlerts = async () => {
  loading.value = true
  try {
    const response = await fetchAlerts(page.value, pageSize.value)
    alerts.value = response.data.items
    total.value = response.data.total
    await loadViolationCounts(alerts.value)
  } catch (error) {
    ElMessage.error('Failed to load alerts')
  } finally {
    loading.value = false
  }
}

const handleMarkRead = async (alertId: string) => {
  try {
    await markAlertRead(alertId)
    await loadAlerts()
  } catch (error) {
    ElMessage.warning('Update failed')
  }
}

const handleMarkAll = async () => {
  try {
    await markAllRead()
    await loadAlerts()
  } catch (error) {
    ElMessage.warning('Update failed')
  }
}

onMounted(loadAlerts)
</script>

<template>
  <section class="panel">
    <div class="panel-header" style="display: flex; justify-content: space-between;">
      <div>
        <div class="page-title" style="font-size: 20px;">Alerts</div>
        <div class="page-subtitle">Violation alerts and read status.</div>
      </div>
      <el-button type="primary" plain @click="handleMarkAll">Mark all read</el-button>
    </div>
    <div class="panel-body">
      <el-table :data="alerts" v-loading="loading" style="width: 100%;">
        <el-table-column prop="created_at" label="Time" width="180">
          <template #default="scope">
            {{ new Date(scope.row.created_at).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="device_id" label="Device" />
        <el-table-column label="Count" width="100">
          <template #default="scope">
            {{ getViolationCount(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="is_read" label="Status" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.is_read ? 'info' : 'danger'">
              {{ scope.row.is_read ? 'Read' : 'Unread' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Action" width="140">
          <template #default="scope">
            <el-button size="small" @click="handleMarkRead(scope.row.id)">Mark read</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          layout="prev, pager, next"
          :total="total"
          @current-change="loadAlerts"
        />
      </div>
    </div>
  </section>
</template>
