<template>
  <div class="admin-layout">
    <Sidebar />
    <Header title="Districts" />
    <main class="main-content">
      <DataTable
        title="All Districts"
        :columns="columns"
        :data="districts"
        :loading="loading"
        :total="districts.length"
        :show-pagination="false"
        :searchable="false"
      >
        <template #name="{ value }">
          <div class="user-cell">
            <div class="user-avatar" style="background: var(--accent-gradient); display: flex; align-items: center; justify-content: center;">🗺️</div>
            <span class="user-name">{{ value }}</span>
          </div>
        </template>
        <template #clubs_count="{ value }">
          <span class="badge badge-primary">{{ value }} clubs</span>
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
  { key: 'name', label: 'District Name' },
  { key: 'clubs_count', label: 'Clubs' }
]

const loading = ref(true)
const districts = ref([])

onMounted(async () => {
  try {
    const data = await adminApi.getDistricts()
    districts.value = data.districts
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>
