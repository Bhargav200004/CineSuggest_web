// Profile.jsx - User profile page showing favorites and ratings
import { useState, useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuth'
import { useUserFavorites, useUserRatings } from '../hooks/useInteractions'
import { useInteractions } from '../hooks/useInteractions'
import { useMovie } from '../hooks/useMovies'
import ApiService from '../services/apiService'
import MovieCard from '../components/MovieCard'
import { Heart, Star, User, Loader2, Film } from 'lucide-react'

function Profile() {
  const { user } = useAuthContext()
  const { favorites, loading: favLoading, fetchFavorites, setFavorites } = useUserFavorites()
  const { ratings, loading: ratingsLoading, fetchRatings, setRatings } = useUserRatings()
  const { toggleFavorite, rateMovie } = useInteractions()
  const [activeTab, setActiveTab] = useState('favorites')
  const [ratingsWithMovies, setRatingsWithMovies] = useState([])

  useEffect(() => {
    fetchFavorites()
    fetchRatings()
  }, [fetchFavorites, fetchRatings])
  
  // Fetch movie details for ratings when ratings data changes
  useEffect(() => {
    const fetchMovieDetailsForRatings = async () => {
      if (ratings.length === 0) {
        setRatingsWithMovies([])
        return
      }
      
      const ratingsWithDetails = await Promise.all(
        ratings.map(async (rating) => {
          try {
            // Use ApiService to fetch movie details
            const movie = await ApiService.getMovieById(rating.movie_id)
            return { ...rating, movie }
          } catch (error) {
            console.error('Failed to fetch movie for rating:', rating.movie_id, error)
            return { ...rating, movie: { id: rating.movie_id, title: 'Unknown Movie' } }
          }
        })
      )
      
      setRatingsWithMovies(ratingsWithDetails)
    }
    
    fetchMovieDetailsForRatings()
  }, [ratings])

  const handleFavoriteToggle = async (movieId, isFavorite) => {
    const result = await toggleFavorite(movieId, isFavorite)
    if (result.success) {
      // Update local state
      if (!isFavorite) {
        setFavorites(prev => prev.filter(m => m.id !== movieId))
      } else {
        await fetchFavorites()
      }
    }
  }

  const handleRate = async (movieId, rating) => {
    const result = await rateMovie(movieId, rating)
    if (result.success) {
      await fetchRatings()
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-mint mx-auto mb-4" />
          <p className="text-soft-gray">Please log in to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-mint/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-mint" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-off-white">{user.username || 'User'}</h1>
              <p className="text-soft-gray">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-surface rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-6 h-6 text-coral" />
              <span className="text-soft-gray">Favorites</span>
            </div>
            <p className="text-3xl font-bold text-off-white">{favorites.length}</p>
          </div>
          <div className="bg-surface rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-6 h-6 text-mint" />
              <span className="text-soft-gray">Rated Movies</span>
            </div>
            <p className="text-3xl font-bold text-off-white">{ratings.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-surface pb-4">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'bg-coral text-white'
                : 'text-soft-gray hover:text-off-white hover:bg-surface'
            }`}
          >
            <Heart className="w-4 h-4" />
            Favorites
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'ratings'
                ? 'bg-mint text-background'
                : 'text-soft-gray hover:text-off-white hover:bg-surface'
            }`}
          >
            <Star className="w-4 h-4" />
            My Ratings
          </button>
        </div>

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div>
            {favLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-10 h-10 text-mint animate-spin" />
              </div>
            ) : favorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {favorites.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isFavorite={true}
                    userRating={movie.user_rating}
                    onFavoriteToggle={handleFavoriteToggle}
                    onRate={handleRate}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Heart className="w-12 h-12 text-coral mx-auto mb-4" />
                <h3 className="text-lg font-medium text-off-white mb-2">No favorites yet</h3>
                <p className="text-soft-gray max-w-md mx-auto">
                  Start adding movies to your favorites by clicking the heart icon!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Ratings Tab */}
        {activeTab === 'ratings' && (
          <div>
            {ratingsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-10 h-10 text-mint animate-spin" />
              </div>
            ) : ratingsWithMovies.length > 0 ? (
              <div className="space-y-4">
                {ratingsWithMovies.map((rating) => (
                  <div key={rating.id} className="bg-surface rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {rating.movie?.poster_path ? (
                        <img 
                          src={rating.movie.poster_path} 
                          alt={rating.movie.title}
                          className="w-10 h-14 object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'block'
                          }}
                        />
                      ) : null}
                      <Film className="w-10 h-10 text-soft-gray" style={{display: rating.movie?.poster_path ? 'none' : 'block'}} />
                      <div>
                        <p className="text-off-white font-medium">{rating.movie?.title || 'Unknown Movie'}</p>
                        <p className="text-soft-gray text-sm">
                          Rated on {new Date(rating.created_at || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            rating.rating >= star
                              ? 'text-mint fill-mint'
                              : 'text-soft-gray'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-off-white font-medium">
                        {rating.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Star className="w-12 h-12 text-mint mx-auto mb-4" />
                <h3 className="text-lg font-medium text-off-white mb-2">No ratings yet</h3>
                <p className="text-soft-gray max-w-md mx-auto">
                  Start rating movies to see them here!
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Profile
