<template>
  <div class="admin-layout">
    <Sidebar />
    <Header title="Posts" />
    <main class="main-content">
      <DataTable
        title="All Posts"
        :columns="columns"
        :data="posts"
        :loading="loading"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        search-placeholder="Search posts..."
        @search="handleSearch"
        @page-change="handlePageChange"
      >
        <template #author_name="{ row }">
          <div class="user-cell">
            <img :src="row.author_logo || 'https://ui-avatars.com/api/?name=' + (row.author_name || 'U')" class="user-avatar" />
            <span class="user-name">{{ row.author_name || 'Unknown' }}</span>
          </div>
        </template>
        <template #content="{ value }">{{ truncate(value, 50) }}</template>
        <template #is_pinned="{ value }">
          <span :class="['badge', value ? 'badge-warning' : 'badge-success']">{{ value ? '📌 Pinned' : 'Regular' }}</span>
        </template>
        <template #actions="{ row }">
          <button class="btn btn-danger" @click="deletePost(row.id)">Delete</button>
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
  { key: 'author_name', label: 'Author' },
  { key: 'content', label: 'Content' },
  { key: 'club_name', label: 'Club' },
  { key: 'is_pinned', label: 'Status' },
  { key: 'actions', label: 'Actions' }
]

const loading = ref(true)
const posts = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = 10
const searchQuery = ref('')

function truncate(str, len) { return str?.length > len ? str.substring(0, len) + '...' : str || '' }

async function fetchPosts() {
  loading.value = true
  try {
    const data = await adminApi.getPosts({ limit: pageSize, offset: (currentPage.value - 1) * pageSize, search: searchQuery.value })
    posts.value = data.posts
    total.value = data.total
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

function handleSearch(query) { searchQuery.value = query; currentPage.value = 1; fetchPosts() }
function handlePageChange(page) { currentPage.value = page; fetchPosts() }
async function deletePost(id) {
  if (confirm('Delete this post?')) {
    await adminApi.deletePost(id)
    fetchPosts()
  }
}

onMounted(fetchPosts)
</script>
