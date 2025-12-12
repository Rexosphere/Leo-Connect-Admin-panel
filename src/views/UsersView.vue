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
        <template #leo_id="{ row }">
          <span class="leo-id">{{ row.leo_id || '—' }}</span>
        </template>
        <template #is_webmaster="{ value }">
          <span :class="['badge', value ? 'badge-primary' : 'badge-success']">{{ value ? 'Webmaster' : 'Member' }}</span>
        </template>
        <template #actions="{ row }">
          <div class="action-buttons">
            <button class="btn btn-sm btn-secondary" @click="openEditModal(row)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="deleteUser(row.uid)">Delete</button>
          </div>
        </template>
      </DataTable>
    </main>

    <FormModal
      v-if="showModal"
      title="Edit User"
      :fields="formFields"
      :initial-data="editData"
      :is-edit="true"
      :loading="saving"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import DataTable from '../components/DataTable.vue'
import FormModal from '../components/FormModal.vue'
import { adminApi } from '../api/admin'

const columns = [
  { key: 'display_name', label: 'User' },
  { key: 'leo_id', label: 'Leo ID' },
  { key: 'assigned_club_id', label: 'Club' },
  { key: 'is_webmaster', label: 'Role' },
  { key: 'actions', label: 'Actions' }
]

const formFields = [
  { key: 'leo_id', label: 'Leo ID', placeholder: 'Enter Leo ID (e.g., LEO-12345)' },
  { key: 'display_name', label: 'Display Name', placeholder: 'User Display Name' },
  { key: 'bio', label: 'Bio', type: 'textarea', placeholder: 'User bio...' },
  { key: 'assigned_club_id', label: 'Assigned Club ID', placeholder: 'club-...' },
  { key: 'is_webmaster', label: 'Webmaster', type: 'checkbox', checkboxLabel: 'Grant webmaster privileges' }
]

const loading = ref(true)
const users = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = 10
const searchQuery = ref('')

// Modal state
const showModal = ref(false)
const editData = ref({})
const saving = ref(false)

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

function openEditModal(user) {
  editData.value = { ...user }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editData.value = {}
}

async function handleSubmit(data) {
  saving.value = true
  try {
    await adminApi.updateUser(editData.value.uid, data)
    closeModal()
    fetchUsers()
  } catch (e) {
    alert('Error: ' + e.message)
  }
  saving.value = false
}

async function deleteUser(id) {
  if (confirm('Delete this user?')) {
    await adminApi.deleteUser(id)
    fetchUsers()
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
}

.btn-secondary {
  background: var(--primary);
  color: white;
}

.btn-secondary:hover {
  background: #5a6fd6;
}

.btn-danger {
  background: var(--danger);
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

.leo-id {
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--text-primary);
}
</style>
