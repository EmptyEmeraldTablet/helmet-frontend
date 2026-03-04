<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchDeviceStats, fetchSummaryStats, fetchTrendStats } from '@/api/stats'
import type { EChartsOption } from 'echarts'
import type { SummaryStats, TrendResponse, DeviceStatsResponse } from '@/types/stats'

const summary = ref<SummaryStats>({
  total_today: 0,
  violations_today: 0,
  violation_rate: 0,
  active_devices: 0,
})

const trend = ref<TrendResponse>({ granularity: 'day', points: [] })
const deviceStats = ref<DeviceStatsResponse>({ items: [] })
const granularity = ref<'hour' | 'day' | 'week'>('day')

const trendOption = ref<EChartsOption>({})
const deviceOption = ref<EChartsOption>({})

const buildTrendOption = () => {
  trendOption.value = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: trend.value.points.map((p) => p.bucket),
    },
    yAxis: { type: 'value' },
    series: [
      {
        data: trend.value.points.map((p) => p.count),
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.12 },
        color: '#0f766e',
      },
    ],
  }
}

const buildDeviceOption = () => {
  deviceOption.value = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: deviceStats.value.items.map((item) => item.device_id),
    },
    yAxis: { type: 'value' },
    series: [
      {
        data: deviceStats.value.items.map((item) => item.count),
        type: 'bar',
        color: '#d97706',
      },
    ],
  }
}

const loadStats = async () => {
  try {
    const [summaryRes, trendRes, deviceRes] = await Promise.all([
      fetchSummaryStats(),
      fetchTrendStats({ granularity: granularity.value }),
      fetchDeviceStats(),
    ])
    summary.value = summaryRes.data
    trend.value = trendRes.data
    deviceStats.value = deviceRes.data
    buildTrendOption()
    buildDeviceOption()
  } catch (error) {
    ElMessage.error('Failed to load stats')
  }
}

watch(granularity, loadStats)

onMounted(loadStats)
</script>

<template>
  <section class="panel">
    <div class="panel-header">
      <div class="page-title" style="font-size: 20px;">Stats</div>
      <div class="page-subtitle">Operational snapshots and trends.</div>
    </div>
    <div class="panel-body">
      <div class="kpi-grid">
        <div class="kpi">
          <div class="kpi-label">Detections Today</div>
          <div class="kpi-value">{{ summary.total_today }}</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Violations Today</div>
          <div class="kpi-value">{{ summary.violations_today }}</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Violation Rate</div>
          <div class="kpi-value">{{ (summary.violation_rate * 100).toFixed(1) }}%</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Active Devices</div>
          <div class="kpi-value">{{ summary.active_devices }}</div>
        </div>
      </div>

      <div style="margin-top: 24px; display: flex; justify-content: space-between; align-items: center;">
        <div class="page-title" style="font-size: 16px;">Trend</div>
        <el-select v-model="granularity" size="small" style="width: 140px;">
          <el-option label="Hourly" value="hour" />
          <el-option label="Daily" value="day" />
          <el-option label="Weekly" value="week" />
        </el-select>
      </div>
      <div style="height: 280px; margin-top: 12px;">
        <VChart :option="trendOption" autoresize />
      </div>

      <div style="margin-top: 24px;" class="page-title">Device Distribution</div>
      <div style="height: 260px; margin-top: 12px;">
        <VChart :option="deviceOption" autoresize />
      </div>
    </div>
  </section>
</template>
