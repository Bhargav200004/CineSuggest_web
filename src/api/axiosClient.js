import axios from 'axios'

// Force HTTPS to prevent mixed content errors
// Temporary fix: Hardcode HTTPS URL to ensure no mixed content issues
const API_BASE_URL = 'https://cinesuggest-production.up.railway.app'

// Debug logging
console.log('Forced HTTPS API Base URL:', API_BASE_URL)
console.log('Environment API URL (ignored):', import.meta.env.VITE_API_URL)

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Follow redirects automatically
  maxRedirects: 5,
  validateStatus: function (status) {
    // Accept 2xx and 3xx status codes
    return status >= 200 && status < 400
  }
})

// Keep reference to base axios for refresh token calls (avoid interceptors)
const baseAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Follow redirects automatically
  maxRedirects: 5,
  validateStatus: function (status) {
    // Accept 2xx and 3xx status codes
    return status >= 200 && status < 400
  }
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to debug redirects
axiosClient.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url)
    if (response.status >= 300 && response.status < 400) {
      console.warn('Redirect detected:', response.status, 'Location:', response.headers.location)
    }
    return response
  },
  (error) => {
    console.error('Request failed:', error.config?.url, 'Status:', error.response?.status)
    if (error.response?.status >= 300 && error.response?.status < 400) {
      console.warn('Redirect error:', error.response.status, 'Location:', error.response.headers.location)
    }
    return Promise.reject(error)
  }
)

let isRefreshing = false
let refreshSubscribers = []

function onRefreshed(token) {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback)
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(axiosClient(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await baseAxios.post('/auth/refresh', {
          refresh_token: refreshToken,
        })

        const { access_token } = response.data
        localStorage.setItem('access_token', access_token)
        
        axiosClient.defaults.headers.Authorization = `Bearer ${access_token}`
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        
        isRefreshing = false
        onRefreshed(access_token)
        
        return axiosClient(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        refreshSubscribers = []
        
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        
        window.location.href = '/login'
        
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosClient
