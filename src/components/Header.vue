<template>
  <header class="header">
    <h1 class="header-title">{{ title }}</h1>
    <div class="header-user">
      <span>{{ authStore.user?.name }}</span>
      <div class="header-user-avatar">A</div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
defineProps({ title: { type: String, default: 'Dashboard' } })
const authStore = useAuthStore()
</script>
