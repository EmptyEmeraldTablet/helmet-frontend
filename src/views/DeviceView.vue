<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  createDevice,
  disableDevice,
  fetchDevices,
  regenerateDeviceKey,
  updateDevice,
} from '@/api/devices'
import type { Device } from '@/types/device'

const devices = ref<Device[]>([])
const loading = ref(false)
const createOpen = ref(false)
const editOpen = ref(false)
const createdKey = ref('')
const editTarget = ref<Device | null>(null)

const createForm = reactive({ name: '' })
const editForm = reactive({ name: '', status: 'active' as 'active' | 'disabled' })

const loadDevices = async () => {
  loading.value = true
  try {
    const response = await fetchDevices()
    devices.value = response.data
  } catch (error) {
    ElMessage.error('Failed to load devices')
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  createdKey.value = ''
  createOpen.value = true
}

const handleCreate = async () => {
  try {
    const response = await createDevice({ name: createForm.name })
    createdKey.value = response.data.api_key
    createForm.name = ''
    await loadDevices()
  } catch (error) {
    ElMessage.error('Device creation failed')
  }
}

const openEdit = (device: Device) => {
  editTarget.value = device
  editForm.name = device.name || ''
  editForm.status = device.status
  editOpen.value = true
}

const handleEdit = async () => {
  if (!editTarget.value) return
  try {
    await updateDevice(editTarget.value.id, {
      name: editForm.name,
      status: editForm.status,
    })
    editOpen.value = false
    await loadDevices()
  } catch (error) {
    ElMessage.error('Update failed')
  }
}

const handleDisable = async (device: Device) => {
  try {
    await disableDevice(device.id)
    await loadDevices()
  } catch (error) {
    ElMessage.error('Disable failed')
  }
}

const handleRegenerate = async (device: Device) => {
  try {
    const response = await regenerateDeviceKey(device.id)
    await loadDevices()
    await ElMessageBox.alert(
      `New API key for ${device.name || device.id}:\n${response.data.api_key}`,
      'API Key regenerated',
      { confirmButtonText: 'OK' },
    )
  } catch (error) {
    ElMessage.error('Key regeneration failed')
  }
}

onMounted(loadDevices)
</script>

<template>
  <section class="panel">
    <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div class="page-title" style="font-size: 20px;">Devices</div>
        <div class="page-subtitle">Manage camera endpoints and API keys.</div>
      </div>
      <el-button type="primary" @click="openCreate">New device</el-button>
    </div>
    <div class="panel-body">
      <el-table :data="devices" v-loading="loading" style="width: 100%;">
        <el-table-column prop="id" label="ID" width="220" />
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="status" label="Status" width="140">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="last_seen_at" label="Last seen" width="200">
          <template #default="scope">
            {{ scope.row.last_seen_at ? new Date(scope.row.last_seen_at).toLocaleString() : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="Action" width="260">
          <template #default="scope">
            <el-button size="small" @click="openEdit(scope.row)">Edit</el-button>
            <el-button size="small" @click="handleRegenerate(scope.row)">Regenerate</el-button>
            <el-button size="small" type="danger" @click="handleDisable(scope.row)">
              Disable
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>

  <el-dialog v-model="createOpen" title="Create device" width="420px">
    <el-form label-position="top">
      <el-form-item label="Device name">
        <el-input v-model="createForm.name" placeholder="Site A - Gate" />
      </el-form-item>
      <el-alert
        v-if="createdKey"
        type="warning"
        :closable="false"
        title="API key (copy now)"
      >
        <div style="font-family: 'Fira Mono', monospace; word-break: break-all;">
          {{ createdKey }}
        </div>
      </el-alert>
    </el-form>
    <template #footer>
      <el-button @click="createOpen = false">Close</el-button>
      <el-button type="primary" @click="handleCreate">Create</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="editOpen" title="Edit device" width="420px">
    <el-form label-position="top">
      <el-form-item label="Device name">
        <el-input v-model="editForm.name" />
      </el-form-item>
      <el-form-item label="Status">
        <el-select v-model="editForm.status">
          <el-option label="Active" value="active" />
          <el-option label="Disabled" value="disabled" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editOpen = false">Cancel</el-button>
      <el-button type="primary" @click="handleEdit">Save</el-button>
    </template>
  </el-dialog>
</template>
