import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Hardcoded admin credentials
const ADMIN_EMAIL = 'admin@leoconnect.com'
const ADMIN_PASSWORD = 'admin123'
const ADMIN_API_KEY = 'leo-admin-secret-2024'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('adminUser') || 'null'))

    const isAuthenticated = computed(() => !!user.value)
    const apiKey = computed(() => user.value ? ADMIN_API_KEY : null)

    function login(email, password) {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            user.value = { email, name: 'Admin' }
            localStorage.setItem('adminUser', JSON.stringify(user.value))
            return { success: true }
        }
        return { success: false, error: 'Invalid credentials' }
    }

    function logout() {
        user.value = null
        localStorage.removeItem('adminUser')
    }

    return { user, isAuthenticated, apiKey, login, logout }
})
