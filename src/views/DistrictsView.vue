<template>
  <div class="admin-layout">
    <Sidebar />
    <Header title="Districts" />
    <main class="main-content">
      <div class="page-actions">
        <button class="btn btn-primary" @click="openCreateModal">+ Create District</button>
      </div>
      <DataTable
        title="All Districts"
        :columns="columns"
        :data="districts"
        :loading="loading"
        :total="total"
        search-placeholder="Search districts..."
        @search="handleSearch"
      >
        <template #name="{ row }">
          <div class="district-name">
            <strong>{{ row.name }}</strong>
          </div>
        </template>
        <template #actions="{ row }">
          <button class="btn btn-sm btn-danger" @click="handleDelete(row)">Delete</button>
        </template>
      </DataTable>
    </main>

    <FormModal
      v-if="showModal"
      title="Create New District"
      :fields="formFields"
      :initial-data="{}"
      :is-edit="false"
      :loading="saving"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import DataTable from '../components/DataTable.vue'
import FormModal from '../components/FormModal.vue'
import { adminApi } from '../api/admin'

const columns = [
  { key: 'name', label: 'District Name' },
  { key: 'total_clubs', label: 'Total Clubs' },
  { key: 'total_members', label: 'Total Members' },
  { key: 'actions', label: 'Actions' }
]

const formFields = [
  { key: 'name', label: 'District Name', required: true, placeholder: '306-A1' },
  { key: 'total_clubs', label: 'Total Clubs', type: 'number', default: 0 },
  { key: 'total_members', label: 'Total Members', type: 'number', default: 0 }
]

const loading = ref(true)
const districts = ref([])
const total = ref(0)
const searchQuery = ref('')
const showModal = ref(false)
const saving = ref(false)

async function fetchDistricts() {
  loading.value = true
  try {
    const data = await adminApi.getDistricts()
    let filtered = data.districts
    if (searchQuery.value) {
      filtered = filtered.filter(d => d.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    }
    districts.value = filtered
    total.value = filtered.length
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

function handleSearch(query) { searchQuery.value = query; fetchDistricts() }

function openCreateModal() { showModal.value = true }
function closeModal() { showModal.value = false }

async function handleSubmit(data) {
  saving.value = true
  try {
    await adminApi.createDistrict(data)
    closeModal()
    fetchDistricts()
  } catch (e) {
    alert('Error: ' + e.message)
  }
  saving.value = false
}

async function handleDelete(district) {
  if (!confirm(`Delete district "${district.name}"? This cannot be undone.`)) return
  try {
    await adminApi.deleteDistrict(district.name)
    fetchDistricts()
  } catch (e) {
    alert('Error: ' + e.message)
  }
}

onMounted(fetchDistricts)
</script>

<style scoped>
.page-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.district-name {
  font-weight: 500;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
}

.btn-danger {
  background: var(--danger);
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}
</style>
