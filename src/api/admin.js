import { useAuthStore } from '../stores/auth'

const API_BASE = import.meta.env.VITE_API_URL || 'https://leoconnect.rexosphere.com'

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
    createUser: (data) => fetchWithAuth('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
    deleteUser: (id) => fetchWithAuth(`/admin/users/${id}`, { method: 'DELETE' }),

    // Clubs
    getClubs: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return fetchWithAuth(`/admin/clubs${query ? '?' + query : ''}`)
    },
    createClub: (data) => fetchWithAuth('/admin/clubs', { method: 'POST', body: JSON.stringify(data) }),
    updateClub: (id, data) => fetchWithAuth(`/admin/clubs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteClub: (id) => fetchWithAuth(`/admin/clubs/${id}`, { method: 'DELETE' }),

    // Districts
    getDistricts: () => fetchWithAuth('/admin/districts'),
    createDistrict: (data) => fetchWithAuth('/admin/districts', { method: 'POST', body: JSON.stringify(data) }),
    deleteDistrict: (name) => fetchWithAuth(`/admin/districts/${encodeURIComponent(name)}`, { method: 'DELETE' }),

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
