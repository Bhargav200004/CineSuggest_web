// Auth Service - Handles authentication state and token management
// Separates auth logic from UI components

const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

class AuthService {
  static getAccessToken() {
    return localStorage.getItem(TOKEN_KEY)
  }

  static getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }

  static setTokens(accessToken, refreshToken) {
    localStorage.setItem(TOKEN_KEY, accessToken)
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    }
  }

  static clearTokens() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }

  static isAuthenticated() {
    return !!this.getAccessToken()
  }

  static getAuthHeaders() {
    const token = this.getAccessToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
}

export default AuthService
