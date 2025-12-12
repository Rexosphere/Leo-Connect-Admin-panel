<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">🦁</div>
        <span class="sidebar-logo-text">Leo Admin</span>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <div class="nav-section">
        <div class="nav-section-title">Overview</div>
        <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
          <span class="nav-item-icon">📊</span>
          <span>Dashboard</span>
        </router-link>
      </div>
      
      <div class="nav-section">
        <div class="nav-section-title">Management</div>
        <router-link to="/users" class="nav-item" :class="{ active: $route.path === '/users' }">
          <span class="nav-item-icon">👥</span>
          <span>Users</span>
        </router-link>
        <router-link to="/clubs" class="nav-item" :class="{ active: $route.path === '/clubs' }">
          <span class="nav-item-icon">🏛️</span>
          <span>Clubs</span>
        </router-link>
        <router-link to="/districts" class="nav-item" :class="{ active: $route.path === '/districts' }">
          <span class="nav-item-icon">🗺️</span>
          <span>Districts</span>
        </router-link>
      </div>
      
      <div class="nav-section">
        <div class="nav-section-title">Content</div>
        <router-link to="/posts" class="nav-item" :class="{ active: $route.path === '/posts' }">
          <span class="nav-item-icon">📝</span>
          <span>Posts</span>
        </router-link>
        <router-link to="/messages" class="nav-item" :class="{ active: $route.path === '/messages' }">
          <span class="nav-item-icon">💬</span>
          <span>Messages</span>
        </router-link>
      </div>
    </nav>
    
    <div class="sidebar-footer">
      <button class="logout-btn" @click="handleLogout">
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
