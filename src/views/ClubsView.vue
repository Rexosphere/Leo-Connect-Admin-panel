<template>
  <div class="admin-layout">
    <Sidebar />
    <Header title="Clubs" />
    <main class="main-content">
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
  { key: 'name', label: 'Club' },
  { key: 'district', label: 'District' },
  { key: 'is_official', label: 'Status' },
  { key: 'email', label: 'Email' }
]

const loading = ref(true)
const clubs = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = 10
const searchQuery = ref('')

async function fetchClubs() {
  loading.value = true
  try {
    const data = await adminApi.getClubs({ limit: pageSize, offset: (currentPage.value - 1) * pageSize, search: searchQuery.value })
    clubs.value = data.clubs
    total.value = data.total
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

function handleSearch(query) { searchQuery.value = query; currentPage.value = 1; fetchClubs() }
function handlePageChange(page) { currentPage.value = page; fetchClubs() }

onMounted(fetchClubs)
</script>
