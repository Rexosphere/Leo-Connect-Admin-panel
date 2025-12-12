import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'https://leoconnect.rexosphere.com'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('adminUser') || 'null'))
    const apiKey = ref(localStorage.getItem('adminApiKey') || null)

    const isAuthenticated = computed(() => !!user.value && !!apiKey.value)

    async function login(email, password) {
        try {
            const response = await fetch(`${API_URL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                return { success: false, error: data.error || 'Login failed' }
            }

            user.value = data.user
            apiKey.value = data.apiKey
            localStorage.setItem('adminUser', JSON.stringify(data.user))
            localStorage.setItem('adminApiKey', data.apiKey)

            return { success: true }
        } catch (e) {
            return { success: false, error: 'Network error. Please try again.' }
        }
    }

    function logout() {
        user.value = null
        apiKey.value = null
        localStorage.removeItem('adminUser')
        localStorage.removeItem('adminApiKey')
    }

    return { user, isAuthenticated, apiKey, login, logout }
})
