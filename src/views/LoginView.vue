<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-logo">
        <div class="login-logo-icon">🦁</div>
        <h1 class="login-logo-text">Leo Admin</h1>
        <p class="login-subtitle">LeoConnect Management Panel</p>
      </div>
      
      <div v-if="error" class="error-message">{{ error }}</div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" v-model="email" placeholder="admin@leoconnect.com" required />
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-input" v-model="password" placeholder="Enter password" required />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  const result = await authStore.login(email.value, password.value)
  if (result.success) router.push('/')
  else error.value = result.error
  loading.value = false
}
</script>
