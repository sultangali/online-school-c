import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://34.116.228.89'
})

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = window.localStorage.getItem('token')
        console.log('📤 Making request to:', config.url)
        
        if (token) {
            console.log('📤 Request headers with token:', `${token.substring(0, 15)}...`)
            config.headers.Authorization = `Bearer ${token}`
        } else {
            console.log('📤 Request without authentication token')
            // Don't set Authorization header when no token exists
        }
        
        return config
    },
    (error) => {
        console.log('❌ Request error:', error.message)
        return Promise.reject(error)
    }
)

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        console.log(`✅ Response from ${response.config.url}:`, {
            status: response.status,
            statusText: response.statusText
        })
        return response
    },
    (error) => {
        console.log('❌ Response error:', {
            url: error.config?.url,
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
        })
        
        if (error.response && error.response.status === 403) {
            console.log('🚫 Authentication error detected')
            // Optional: Handle token expiration or invalid token
            // window.localStorage.removeItem('token')
        }
        return Promise.reject(error)
    }
)

export default instance
