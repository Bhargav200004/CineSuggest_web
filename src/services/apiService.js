// API Service Layer - Handles all backend communication
// Follows Single Responsibility Principle - only API calls, no UI logic

import axiosClient from '../api/axiosClient'

class ApiService {
  // Auth endpoints
  static async login(username, password) {
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)

    const response = await axiosClient.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return response.data
  }

  static async register(userData) {
    const response = await axiosClient.post('/auth/register', userData)
    return response.data
  }

  static async getCurrentUser() {
    const response = await axiosClient.get('/auth/me')
    return response.data
  }

  static async refreshToken(refreshToken) {
    const response = await axiosClient.post('/auth/refresh', {
      refresh_token: refreshToken,
    })
    return response.data
  }

  // Movie endpoints
  static async getMovies(skip = 0, limit = 20, filters = {}) {
    const params = new URLSearchParams()
    params.append('skip', skip)
    params.append('limit', limit)
    
    if (filters.genre) params.append('genre', filters.genre)
    if (filters.year) params.append('year', filters.year)
    if (filters.minRating) params.append('min_rating', filters.minRating)
    if (filters.sortBy) params.append('sort_by', filters.sortBy)
    if (filters.sortOrder) params.append('sort_order', filters.sortOrder)
    
    const queryString = params.toString()
    const response = await axiosClient.get(`/movies?${queryString}`)
    return response.data
  }

  static async getMovieById(movieId) {
    const response = await axiosClient.get(`/movies/${movieId}`)
    return response.data
  }

  static async searchMovies(query, limit = 20) {
    const response = await axiosClient.get(
      `/movies/search?q=${encodeURIComponent(query)}&limit=${limit}`
    )
    return response.data
  }

  static async getRandomMovies(limit = 10) {
    const response = await axiosClient.get(`/movies/random`)
    return response.data
  }

  static async getGenres() {
    const response = await axiosClient.get('/genres')
    return response.data
  }

  // User interactions
  static async rateMovie(movieId, rating) {
    const response = await axiosClient.post('/interactions/ratings', {
      movie_id: movieId,
      rating,
    })
    return response.data
  }

  static async deleteRating(movieId) {
    await axiosClient.delete(`/interactions/ratings/${movieId}`)
  }

  static async addToFavorites(movieId) {
    const response = await axiosClient.post('/interactions/favorites', {
      movie_id: movieId,
    })
    return response.data
  }

  static async removeFromFavorites(movieId) {
    await axiosClient.delete(`/interactions/favorites/${movieId}`)
  }

  static async getUserFavorites() {
    const response = await axiosClient.get('/interactions/favorites')
    return response.data
  }

  static async getUserRatings() {
    const response = await axiosClient.get('/interactions/ratings')
    return response.data
  }

  // Recommendations
  static async getRecommendations(userId) {
    if (!userId) {
      return []
    }
    const response = await axiosClient.get(`/recommend/${userId}`)
    return response.data
  }
}

export default ApiService
