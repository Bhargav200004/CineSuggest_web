// Custom hook for user interactions (ratings, favorites)
// Separates interaction logic from UI components
import { useState, useCallback } from 'react'
import ApiService from '../services/apiService'

export function useInteractions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const rateMovie = useCallback(async (movieId, rating) => {
    setLoading(true)
    setError(null)

    try {
      const result = await ApiService.rateMovie(movieId, rating)
      return { success: true, data: result }
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Failed to rate movie'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteRating = useCallback(async (movieId) => {
    setLoading(true)
    setError(null)

    try {
      await ApiService.deleteRating(movieId)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Failed to delete rating'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleFavorite = useCallback(async (movieId, isFavorite) => {
    setLoading(true)
    setError(null)

    try {
      if (isFavorite) {
        await ApiService.addToFavorites(movieId)
      } else {
        await ApiService.removeFromFavorites(movieId)
      }
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Failed to update favorite'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    loading,
    error,
    rateMovie,
    deleteRating,
    toggleFavorite,
    clearError,
  }
}

export function useUserFavorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchFavorites = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await ApiService.getUserFavorites()
      // Backend returns { movies: [...] } for favorites endpoint
      const movies = data.movies || []
      setFavorites(movies)
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    setFavorites,
  }
}

export function useUserRatings() {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRatings = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await ApiService.getUserRatings()
      // Backend returns ratings array directly or wrapped
      const ratingsArray = Array.isArray(data) ? data : (data.ratings || [])
      setRatings(ratingsArray)
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load ratings')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    ratings,
    loading,
    error,
    fetchRatings,
    setRatings,
  }
}
