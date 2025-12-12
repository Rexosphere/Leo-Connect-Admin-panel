import { useAuthStore } from '../stores/auth'

const API_BASE = 'https://leoconnect.rexosphere.com'

async function fetchWithAuth(endpoint, options = {}) {
    const authStore = useAuthStore()

    const headers = {
        'Content-Type': 'application/json',
        'X-Admin-Key': authStore.apiKey,
        ...options.headers
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(error.error || 'Request failed')
    }

    return response.json()
}

export const adminApi = {
    // Dashboard stats
    getStats: () => fetchWithAuth('/admin/stats'),

    // Users
    getUsers: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return fetchWithAuth(`/admin/users${query ? '?' + query : ''}`)
    },
    deleteUser: (id) => fetchWithAuth(`/admin/users/${id}`, { method: 'DELETE' }),

    // Clubs
    getClubs: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return fetchWithAuth(`/admin/clubs${query ? '?' + query : ''}`)
    },

    // Districts
    getDistricts: () => fetchWithAuth('/admin/districts'),

    // Posts
    getPosts: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return fetchWithAuth(`/admin/posts${query ? '?' + query : ''}`)
    },
    deletePost: (id) => fetchWithAuth(`/admin/posts/${id}`, { method: 'DELETE' }),

    // Messages
    getMessages: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return fetchWithAuth(`/admin/messages${query ? '?' + query : ''}`)
    }
}
