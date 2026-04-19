// MovieDetails.jsx - Simplified and fixed version
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMovie } from '../hooks/useMovies'
import { useInteractions, useUserFavorites, useUserRatings } from '../hooks/useInteractions'
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  Calendar, 
  Clock, 
  DollarSign, 
  Globe,
  Film,
  Loader2,
  ThumbsUp,
  TrendingUp,
  Award
} from 'lucide-react'

function MovieDetails() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  
  // Parse movieId safely
  const parsedMovieId = movieId ? Number(movieId) : null
  console.log('MovieDetails - movieId:', movieId, 'parsed:', parsedMovieId)
  
  const { movie, loading, error, refetch } = useMovie(parsedMovieId)
  const { toggleFavorite, rateMovie, loading: actionLoading } = useInteractions()
  const { favorites, fetchFavorites } = useUserFavorites()
  const { ratings, fetchRatings } = useUserRatings()
  
  // Local state for immediate UI feedback
  const [userRating, setUserRating] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)
  
  // Check if user has favorited this movie
  useEffect(() => {
    console.log('MovieDetails Debug - movie:', movie)
    console.log('MovieDetails Debug - favorites:', favorites)
    
    // Check immediately when favorites load or when movie loads
    if (movie) {
      const isFav = favorites.some(fav => fav.id === movie.id)
      console.log('MovieDetails Debug - isFavorite:', isFav, 'for movie ID:', movie.id)
      setIsFavorite(isFav)
    }
  }, [movie, favorites])
  
  // Check if user has rated this movie
  useEffect(() => {
    console.log('MovieDetails Debug - ratings:', ratings)
    
    // Check immediately when ratings load or when movie loads
    if (movie) {
      const userRatingData = ratings.find(rating => rating.movie_id === movie.id)
      console.log('MovieDetails Debug - found rating data:', userRatingData)
      setUserRating(Number(userRatingData?.rating) || 0)
    }
  }, [movie, ratings])
  
  // Fetch user interactions when component mounts (like Profile screen)
  useEffect(() => {
    fetchFavorites()
    fetchRatings()
  }, [fetchFavorites, fetchRatings])

  const handleFavoriteToggle = async () => {
    if (!movie) return
    const newState = !isFavorite
    setIsFavorite(newState)
    const result = await toggleFavorite(movie.id, newState)
    if (result.success) {
      // Refetch interaction data like Profile screen
      await fetchFavorites()
    } else {
      setIsFavorite(!newState)
    }
  }

  const handleRate = async (rating) => {
    if (!movie || actionLoading) return
    const previousRating = userRating
    setUserRating(rating)
    const result = await rateMovie(movie.id, rating)
    if (result.success) {
      // Refetch interaction data like Profile screen
      await fetchRatings()
    } else {
      setUserRating(previousRating)
    }
  }

  const formatCurrency = (value) => {
    if (!value) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatRuntime = (runtime) => {
    if (!runtime) return 'N/A'
    const minutes = parseInt(runtime)
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Debug: Log the current state
  console.log('MovieDetails state:', { loading, error, movie, movieId, parsedMovieId })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-mint animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <Film className="w-16 h-16 text-soft-gray mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-off-white mb-2">
            Error Loading Movie
          </h2>
          <p className="text-soft-gray mb-6">
            {error}
          </p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-mint text-background font-medium rounded-xl hover:bg-mint/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Movies
          </button>
        </div>
      </div>
    )
  }

  // No movie state
  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <Film className="w-16 h-16 text-soft-gray mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-off-white mb-2">
            Movie Not Found
          </h2>
          <p className="text-soft-gray mb-6">
            The movie you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-mint text-background font-medium rounded-xl hover:bg-mint/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Movies
          </button>
        </div>
      </div>
    )
  }

  const posterUrl = movie.poster_path || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzFBMjIzNSIvPjx0ZXh0IHg9IjE1MCIgeT0iMjI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIFBvc3RlcjwvdGV4dD48L3N2Zz4='
  const genres = movie.genre ? movie.genre.split('|') : []
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-soft-gray hover:text-off-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-surface">
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzFBMjIzNSIvPjx0ZXh0IHg9IjE1MCIgeT0iMjI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIFBvc3RlcjwvdGV4dD48L3N2Zz4='
                  }}
                />
                
                {/* Favorite Button */}
                <button
                  onClick={handleFavoriteToggle}
                  disabled={actionLoading}
                  className={`absolute top-4 right-4 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                    isFavorite
                      ? 'bg-coral text-white shadow-lg shadow-coral/30'
                      : 'bg-black/60 text-white hover:bg-coral/80 backdrop-blur-sm'
                  } disabled:opacity-50`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-6 h-6 transition-all duration-300 ${isFavorite ? 'fill-current scale-110' : ''}`} />
                </button>
                
                {/* Favorite Badge */}
                {isFavorite && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-coral text-white text-xs font-semibold rounded-full shadow-lg">
                    <Heart className="w-3 h-3 inline mr-1 fill-current" />
                    Favorite
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-off-white">
                  {movie.title}
                </h1>
                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-mint/10 rounded-lg shrink-0">
                    <Star className="w-5 h-5 text-mint fill-mint" />
                    <span className="text-lg font-semibold text-mint">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {releaseYear && (
                <p className="text-soft-gray text-lg">{releaseYear}</p>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-surface text-off-white text-sm rounded-lg"
                  >
                    {genre.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            {movie.overview && (
              <div>
                <h2 className="text-lg font-semibold text-off-white mb-2">
                  Overview
                </h2>
                <p className="text-soft-gray leading-relaxed">
                  {movie.overview}
                </p>
              </div>
            )}

            {/* Meta Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-surface rounded-xl">
                <div className="flex items-center gap-2 text-soft-gray mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Released</span>
                </div>
                <p className="text-off-white font-medium">
                  {formatDate(movie.release_date)}
                </p>
              </div>

              <div className="p-4 bg-surface rounded-xl">
                <div className="flex items-center gap-2 text-soft-gray mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Runtime</span>
                </div>
                <p className="text-off-white font-medium">
                  {formatRuntime(movie.runtime)}
                </p>
              </div>

              <div className="p-4 bg-surface rounded-xl">
                <div className="flex items-center gap-2 text-soft-gray mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Revenue</span>
                </div>
                <p className="text-off-white font-medium">
                  {formatCurrency(movie.revenue)}
                </p>
              </div>

              <div className="p-4 bg-surface rounded-xl">
                <div className="flex items-center gap-2 text-soft-gray mb-1">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">Language</span>
                </div>
                <p className="text-off-white font-medium uppercase">
                  {movie.original_language || 'N/A'}
                </p>
              </div>
            </div>

            {/* User Rating Section */}
            <div className="p-6 bg-surface rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-off-white">
                  Your Rating
                </h2>
                {userRating > 0 && (
                  <span className="text-2xl font-bold text-mint">
                    {userRating.toFixed(1)}
                  </span>
                )}
              </div>
              
              {/* 5-Star Rating */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    disabled={actionLoading}
                    className="p-1 disabled:opacity-50 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors duration-200 ${
                        (hoveredRating || userRating) >= star
                          ? 'text-mint fill-mint'
                          : 'text-soft-gray hover:text-mint/50'
                      }`}
                    />
                  </button>
                ))}
              </div>
              
              <p className="mt-3 text-soft-gray text-sm">
                {userRating > 0 
                  ? `You rated this ${userRating.toFixed(1)} out of 5`
                  : 'Click a star to rate this movie'
                }
              </p>
            </div>
            
            {/* Additional Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-surface rounded-xl text-center">
                <TrendingUp className="w-6 h-6 text-mint mx-auto mb-2" />
                <p className="text-2xl font-bold text-off-white">
                  {movie.vote_count?.toLocaleString() || 'N/A'}
                </p>
                <p className="text-soft-gray text-xs">Total Votes</p>
              </div>
              <div className="p-4 bg-surface rounded-xl text-center">
                <Award className="w-6 h-6 text-mint mx-auto mb-2" />
                <p className="text-2xl font-bold text-off-white">
                  {movie.vote_average?.toFixed(1) || 'N/A'}
                </p>
                <p className="text-soft-gray text-xs">Avg Rating</p>
              </div>
              <div className="p-4 bg-surface rounded-xl text-center">
                <ThumbsUp className="w-6 h-6 text-mint mx-auto mb-2" />
                <p className="text-2xl font-bold text-off-white">
                  {movie.popularity?.toFixed(0) || 'N/A'}
                </p>
                <p className="text-soft-gray text-xs">Popularity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
