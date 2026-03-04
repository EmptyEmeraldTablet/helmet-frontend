<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await auth.login(form.username, form.password)
    const redirect = (route.query.redirect as string) || '/monitor'
    router.push(redirect)
  } catch (error) {
    ElMessage.error('Login failed. Check credentials and try again.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    style="min-height: 100vh; display: grid; place-items: center; padding: 32px;"
  >
    <div
      class="panel"
      style="max-width: 420px; width: 100%; padding: 28px; border-radius: var(--radius-lg);"
    >
      <div style="margin-bottom: 20px;">
        <div class="page-title">HelmetOps Console</div>
        <div class="page-subtitle">Administrator access</div>
      </div>
      <el-form label-position="top" @submit.prevent="handleSubmit">
        <el-form-item label="Username">
          <el-input v-model="form.username" placeholder="admin" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-button type="primary" :loading="loading" style="width: 100%;" @click="handleSubmit">
          Sign in
        </el-button>
      </el-form>
    </div>
  </div>
</template>
