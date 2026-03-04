<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchResults, fetchResultDetail } from '@/api/results'
import { fetchDevices } from '@/api/devices'
import type { ResultItem, ResultDetail } from '@/types/result'
import type { Device } from '@/types/device'

const devices = ref<Device[]>([])
const results = ref<ResultItem[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const loading = ref(false)
const drawerOpen = ref(false)
const detail = ref<ResultDetail | null>(null)

const filters = reactive({
  range: null as [Date, Date] | null,
  deviceId: '',
  hasViolation: undefined as boolean | undefined,
})

const loadDevices = async () => {
  try {
    const response = await fetchDevices()
    devices.value = response.data
  } catch (error) {
    ElMessage.warning('Unable to load device list')
  }
}

const loadResults = async () => {
  loading.value = true
  try {
    const params = {
      page: page.value,
      page_size: pageSize.value,
      device_id: filters.deviceId || undefined,
      has_violation: filters.hasViolation,
      start_time: filters.range ? filters.range[0].toISOString() : undefined,
      end_time: filters.range ? filters.range[1].toISOString() : undefined,
    }
    const response = await fetchResults(params)
    results.value = response.data.items
    total.value = response.data.total
  } catch (error) {
    ElMessage.error('Failed to load results. Check server status.')
  } finally {
    loading.value = false
  }
}

const handleRowClick = async (row: ResultItem) => {
  try {
    const response = await fetchResultDetail(row.task_id)
    detail.value = response.data
    drawerOpen.value = true
  } catch (error) {
    ElMessage.warning('Detail fetch failed')
  }
}

onMounted(async () => {
  await loadDevices()
  await loadResults()
})
</script>

<template>
  <section class="panel">
    <div class="panel-header">
      <div class="page-title" style="font-size: 20px;">History</div>
      <div class="page-subtitle">Search by device, time range, and violations.</div>
    </div>
    <div class="panel-body">
      <el-form inline label-position="top">
        <el-form-item label="Time Range">
          <el-date-picker
            v-model="filters.range"
            type="datetimerange"
            range-separator="to"
            start-placeholder="Start"
            end-placeholder="End"
          />
        </el-form-item>
        <el-form-item label="Device">
          <el-select v-model="filters.deviceId" placeholder="All devices" clearable>
            <el-option
              v-for="device in devices"
              :key="device.id"
              :label="device.name || device.id"
              :value="device.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Violation">
          <el-select v-model="filters.hasViolation" placeholder="All" clearable>
            <el-option label="Only violations" :value="true" />
            <el-option label="Compliant only" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadResults">Search</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="results"
        v-loading="loading"
        style="width: 100%; margin-top: 16px;"
        @row-click="handleRowClick"
      >
        <el-table-column prop="created_at" label="Time" width="180">
          <template #default="scope">
            {{ new Date(scope.row.created_at).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="device_id" label="Device" />
        <el-table-column prop="detections" label="Detections" width="120">
          <template #default="scope">
            {{ scope.row.detections.length }}
          </template>
        </el-table-column>
        <el-table-column prop="has_violation" label="Violation" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.has_violation ? 'danger' : 'success'">
              {{ scope.row.has_violation ? 'Yes' : 'No' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          layout="prev, pager, next"
          :total="total"
          @current-change="loadResults"
        />
      </div>
    </div>
  </section>

  <el-drawer v-model="drawerOpen" size="45%" title="Result detail">
    <div v-if="detail">
      <div style="margin-bottom: 12px; color: var(--color-muted);">
        {{ detail.task_id }} · {{ new Date(detail.created_at).toLocaleString() }}
      </div>
      <img
        v-if="detail.annotated_image_url"
        :src="detail.annotated_image_url"
        alt="annotated"
        style="width: 100%; border-radius: 12px; margin-bottom: 16px;"
      />
      <el-descriptions :column="1" border>
        <el-descriptions-item label="Device">{{ detail.device_id }}</el-descriptions-item>
        <el-descriptions-item label="Violations">
          {{ detail.has_violation ? 'Yes' : 'No' }}
        </el-descriptions-item>
        <el-descriptions-item label="Detections">
          {{ detail.detections.length }}
        </el-descriptions-item>
        <el-descriptions-item label="Process Time">
          {{ detail.process_time_ms ?? '-' }} ms
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-drawer>
</template>
