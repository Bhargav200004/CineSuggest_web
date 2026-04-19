// Custom hook for movie data - encapsulates all movie fetching logic
import { useState, useEffect, useCallback } from 'react'
import ApiService from '../services/apiService'
import { useAuthContext } from './useAuth'

export function useMovies(skip = 0, limit = 20) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})

  const fetchMovies = useCallback(async (fetchSkip = skip, fetchLimit = limit, fetchFilters = filters) => {
    setLoading(true)
    setError(null)

    try {
      const data = await ApiService.getMovies(fetchSkip, fetchLimit, fetchFilters)
      setMovies(data.movies || [])
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load movies')
    } finally {
      setLoading(false)
    }
  }, [skip, limit, filters])

  const searchMovies = useCallback(async (query) => {
    setLoading(true)
    setError(null)

    try {
      const data = await ApiService.searchMovies(query, limit)
      setMovies(data.movies || [])
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }, [limit])

  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  // Fetch on mount and when skip/limit/filters change
  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])

  return {
    movies,
    loading,
    error,
    filters,
    fetchMovies,
    searchMovies,
    setMovies,
    updateFilters,
  }
}

export function useMovie(movieId) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMovie = useCallback(async () => {
    if (!movieId) return

    setLoading(true)
    setError(null)

    try {
      const data = await ApiService.getMovieById(movieId)
      setMovie(data)
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load movie')
    } finally {
      setLoading(false)
    }
  }, [movieId])

  useEffect(() => {
    if (movieId) {
      fetchMovie()
    }
  }, [movieId])

  return { movie, loading, error, refetch: fetchMovie }
}

export function useRandomMovies(limit = 10) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRandom = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await ApiService.getRandomMovies(limit)
      // Handle both { movies: [...] } and direct array response
      const moviesArray = Array.isArray(data) ? data : (data.movies || [])
      setMovies(moviesArray)
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load random movies')
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchRandom()
  }, [fetchRandom])

  return { movies, loading, error, refetch: fetchRandom }
}

export function useRecommendations(limit = 10) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuthContext()

  const fetchRecommendations = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await ApiService.getRecommendations(user?.id)
      setRecommendations(data.recommendations || [])
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id) {
      fetchRecommendations()
    }
  }, [fetchRecommendations, user?.id])

  return { recommendations, loading, error, refetch: fetchRecommendations }
}
