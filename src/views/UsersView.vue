<template>
  <div class="admin-layout">
    <Sidebar />
    <Header title="Users" />
    <main class="main-content">
      <DataTable
        title="All Users"
        :columns="columns"
        :data="users"
        :loading="loading"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        search-placeholder="Search users..."
        @search="handleSearch"
        @page-change="handlePageChange"
      >
        <template #display_name="{ row }">
          <div class="user-cell">
            <img :src="row.photo_url || 'https://ui-avatars.com/api/?name=' + row.display_name" class="user-avatar" />
            <div class="user-info">
              <span class="user-name">{{ row.display_name }}</span>
              <span class="user-email">{{ row.email }}</span>
            </div>
          </div>
        </template>
        <template #is_webmaster="{ value }">
          <span :class="['badge', value ? 'badge-primary' : 'badge-success']">{{ value ? 'Webmaster' : 'Member' }}</span>
        </template>
        <template #actions="{ row }">
          <button class="btn btn-danger" @click="deleteUser(row.uid)">Delete</button>
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
  { key: 'display_name', label: 'User' },
  { key: 'leo_id', label: 'Leo ID' },
  { key: 'assigned_club_id', label: 'Club' },
  { key: 'is_webmaster', label: 'Role' },
  { key: 'actions', label: 'Actions' }
]

const loading = ref(true)
const users = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = 10
const searchQuery = ref('')

async function fetchUsers() {
  loading.value = true
  try {
    const data = await adminApi.getUsers({ limit: pageSize, offset: (currentPage.value - 1) * pageSize, search: searchQuery.value })
    users.value = data.users
    total.value = data.total
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

function handleSearch(query) { searchQuery.value = query; currentPage.value = 1; fetchUsers() }
function handlePageChange(page) { currentPage.value = page; fetchUsers() }
async function deleteUser(id) {
  if (confirm('Delete this user?')) {
    await adminApi.deleteUser(id)
    fetchUsers()
  }
}

onMounted(fetchUsers)
</script>
