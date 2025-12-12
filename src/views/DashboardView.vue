<template>
  <div class="admin-layout">
    <Sidebar />
    <Header title="Dashboard" />
    <main class="main-content">
      <div class="stats-grid">
        <StatsCard icon="👥" :value="stats.users" label="Total Users" />
        <StatsCard icon="🏛️" :value="stats.clubs" label="Total Clubs" />
        <StatsCard icon="📝" :value="stats.posts" label="Total Posts" />
        <StatsCard icon="💬" :value="stats.messages" label="Total Messages" />
        <StatsCard icon="🗺️" :value="stats.districts" label="Districts" />
        <StatsCard icon="💭" :value="stats.comments" label="Comments" />
      </div>
      
      <div v-if="loading" class="loading"><div class="spinner"></div></div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import StatsCard from '../components/StatsCard.vue'
import { adminApi } from '../api/admin'

const loading = ref(true)
const error = ref('')
const stats = ref({ users: 0, clubs: 0, posts: 0, messages: 0, districts: 0, comments: 0 })

onMounted(async () => {
  try {
    stats.value = await adminApi.getStats()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>
