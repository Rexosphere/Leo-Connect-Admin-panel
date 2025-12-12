<template>
  <div class="admin-layout">
    <Sidebar />
    <Header title="Messages" />
    <main class="main-content">
      <DataTable
        title="All Messages"
        :columns="columns"
        :data="messages"
        :loading="loading"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        :searchable="false"
        @page-change="handlePageChange"
      >
        <template #sender_name="{ row }">
          <div class="user-cell">
            <img :src="row.sender_photo || 'https://ui-avatars.com/api/?name=' + (row.sender_name || 'U')" class="user-avatar" />
            <span class="user-name">{{ row.sender_name || 'Unknown' }}</span>
          </div>
        </template>
        <template #receiver_name="{ row }">
          <div class="user-cell">
            <img :src="row.receiver_photo || 'https://ui-avatars.com/api/?name=' + (row.receiver_name || 'U')" class="user-avatar" />
            <span class="user-name">{{ row.receiver_name || 'Unknown' }}</span>
          </div>
        </template>
        <template #content="{ value }">{{ truncate(value, 40) }}</template>
        <template #is_read="{ value }">
          <span :class="['badge', value ? 'badge-success' : 'badge-warning']">{{ value ? 'Read' : 'Unread' }}</span>
        </template>
      </DataTable>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import DataTable from '../components/DataTable.vue'
import { adminApi } from '../api/admin'

const columns = [
  { key: 'sender_name', label: 'Sender' },
  { key: 'receiver_name', label: 'Receiver' },
  { key: 'content', label: 'Message' },
  { key: 'is_read', label: 'Status' }
]

const loading = ref(true)
const messages = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = 10

function truncate(str, len) { return str?.length > len ? str.substring(0, len) + '...' : str || '' }

async function fetchMessages() {
  loading.value = true
  try {
    const data = await adminApi.getMessages({ limit: pageSize, offset: (currentPage.value - 1) * pageSize })
    messages.value = data.messages
    total.value = data.total
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

function handlePageChange(page) { currentPage.value = page; fetchMessages() }

onMounted(fetchMessages)
</script>
