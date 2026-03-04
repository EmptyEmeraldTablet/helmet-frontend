<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchSettings, updateSettings } from '@/api/settings'
import type { SystemConfigResponse } from '@/types/settings'

const loading = ref(false)
const form = reactive<SystemConfigResponse>({
  inference_confidence: 0.5,
  max_queue_size: 10,
  data_retention_days: 30,
  alert_webhook_url: '',
  alert_webhook_enabled: false,
})

const loadSettings = async () => {
  loading.value = true
  try {
    const response = await fetchSettings()
    Object.assign(form, response.data)
  } catch (error) {
    ElMessage.error('Failed to load settings')
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  try {
    await updateSettings({ ...form })
    ElMessage.success('Settings saved')
  } catch (error) {
    ElMessage.error('Save failed')
  }
}

onMounted(loadSettings)
</script>

<template>
  <section class="panel">
    <div class="panel-header">
      <div class="page-title" style="font-size: 20px;">Settings</div>
      <div class="page-subtitle">Inference and retention configuration.</div>
    </div>
    <div class="panel-body">
      <el-form label-position="top" :model="form" v-loading="loading" style="max-width: 520px;">
        <el-form-item label="Inference confidence">
          <el-slider v-model="form.inference_confidence" :min="0.1" :max="0.9" :step="0.05" />
        </el-form-item>
        <el-form-item label="Max queue size">
          <el-input-number v-model="form.max_queue_size" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="Data retention days">
          <el-input-number v-model="form.data_retention_days" :min="1" :max="365" />
        </el-form-item>
        <el-form-item label="Alert webhook URL">
          <el-input v-model="form.alert_webhook_url" placeholder="https://..." />
        </el-form-item>
        <el-form-item label="Enable webhook">
          <el-switch v-model="form.alert_webhook_enabled" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">Save settings</el-button>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>
