<template>
  <div class="data-card">
    <div class="data-card-header">
      <h2 class="data-card-title">{{ title }}</h2>
      <input 
        v-if="searchable"
        type="text" 
        class="search-input" 
        :placeholder="searchPlaceholder"
        v-model="searchQuery"
        @input="$emit('search', searchQuery)"
      />
    </div>
    
    <div v-if="loading" class="loading"><div class="spinner"></div></div>
    
    <div v-else-if="!data || data.length === 0" class="empty-state">
      <div class="empty-state-icon">📭</div>
      <p>No data available</p>
    </div>
    
    <table v-else class="data-table">
      <thead>
        <tr><th v-for="col in columns" :key="col.key">{{ col.label }}</th></tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data" :key="index">
          <td v-for="col in columns" :key="col.key">
            <slot :name="col.key" :row="row" :value="row[col.key]">{{ row[col.key] }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="showPagination && data && data.length > 0" class="pagination">
      <span class="pagination-info">Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ total }} entries</span>
      <div class="pagination-buttons">
        <button class="pagination-btn" :disabled="currentPage === 1" @click="$emit('page-change', currentPage - 1)">Previous</button>
        <button class="pagination-btn" :disabled="endIndex >= total" @click="$emit('page-change', currentPage + 1)">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  title: { type: String, default: 'Data' },
  columns: { type: Array, required: true },
  data: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  searchable: { type: Boolean, default: true },
  searchPlaceholder: { type: String, default: 'Search...' },
  showPagination: { type: Boolean, default: true },
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  total: { type: Number, default: 0 }
})
defineEmits(['search', 'page-change'])
const searchQuery = ref('')
const startIndex = computed(() => (props.currentPage - 1) * props.pageSize)
const endIndex = computed(() => Math.min(startIndex.value + props.pageSize, props.total))
</script>
