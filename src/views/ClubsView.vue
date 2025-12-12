<template>
  <div class="admin-layout">
    <Sidebar />
    <Header title="Clubs" />
    <main class="main-content">
      <div class="page-actions">
        <button class="btn btn-primary" @click="openCreateModal">+ Create Club</button>
      </div>
      <DataTable
        title="All Clubs"
        :columns="columns"
        :data="clubs"
        :loading="loading"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        search-placeholder="Search clubs..."
        @search="handleSearch"
        @page-change="handlePageChange"
      >
        <template #name="{ row }">
          <div class="user-cell">
            <img :src="row.logo_url || 'https://ui-avatars.com/api/?name=' + row.name + '&background=667eea&color=fff'" class="user-avatar" />
            <div class="user-info">
              <span class="user-name">{{ row.name }}</span>
              <span class="user-email">{{ row.district }}</span>
            </div>
          </div>
        </template>
        <template #is_official="{ value }">
          <span :class="['badge', value ? 'badge-success' : 'badge-warning']">{{ value ? 'Official' : 'Pending' }}</span>
        </template>
        <template #actions="{ row }">
          <div class="action-buttons">
            <button class="btn btn-sm btn-secondary" @click="openEditModal(row)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="handleDelete(row)">Delete</button>
          </div>
        </template>
      </DataTable>
    </main>

    <FormModal
      v-if="showModal"
      :title="isEdit ? 'Edit Club' : 'Create New Club'"
      :fields="formFields"
      :initial-data="editData"
      :is-edit="isEdit"
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
  { key: 'name', label: 'Club' },
  { key: 'district', label: 'District' },
  { key: 'is_official', label: 'Status' },
  { key: 'email', label: 'Email' },
  { key: 'actions', label: 'Actions' }
]

const loading = ref(true)
const clubs = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = 10
const searchQuery = ref('')

// Modal state
const showModal = ref(false)
const isEdit = ref(false)
const editData = ref({})
const saving = ref(false)
const districts = ref([])

const formFields = computed(() => [
  { key: 'name', label: 'Club Name', required: true, placeholder: 'Leo Club of...' },
  { key: 'district', label: 'District', required: true, type: 'select', options: districts.value.map(d => ({ value: d.name, label: d.name })) },
  { key: 'district_id', label: 'District ID', required: true, placeholder: '306-A1' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Club description...' },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'club@email.com' },
  { key: 'phone', label: 'Phone', placeholder: '+94 77...' },
  { key: 'address', label: 'Address', placeholder: 'Club address' },
  { key: 'logo_url', label: 'Logo URL', placeholder: 'https://...' },
  { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
  { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
  { key: 'is_official', label: 'Official Status', type: 'checkbox', checkboxLabel: 'Mark as Official Club' }
])

async function fetchClubs() {
  loading.value = true
  try {
    const data = await adminApi.getClubs({ limit: pageSize, offset: (currentPage.value - 1) * pageSize, search: searchQuery.value })
    clubs.value = data.clubs
    total.value = data.total
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

async function fetchDistricts() {
  try {
    const data = await adminApi.getDistricts()
    districts.value = data.districts
  } catch (e) { console.error(e) }
}

function handleSearch(query) { searchQuery.value = query; currentPage.value = 1; fetchClubs() }
function handlePageChange(page) { currentPage.value = page; fetchClubs() }

function openCreateModal() {
  isEdit.value = false
  editData.value = {}
  showModal.value = true
}

function openEditModal(club) {
  isEdit.value = true
  editData.value = { ...club }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editData.value = {}
}

async function handleSubmit(data) {
  saving.value = true
  try {
    if (isEdit.value) {
      await adminApi.updateClub(editData.value.id, data)
    } else {
      await adminApi.createClub(data)
    }
    closeModal()
    fetchClubs()
  } catch (e) {
    alert('Error: ' + e.message)
  }
  saving.value = false
}

async function handleDelete(club) {
  if (!confirm(`Delete club "${club.name}"? This cannot be undone.`)) return
  try {
    await adminApi.deleteClub(club.id)
    fetchClubs()
  } catch (e) {
    alert('Error: ' + e.message)
  }
}

onMounted(() => {
  fetchClubs()
  fetchDistricts()
})
</script>

<style scoped>
.page-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

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
</style>
