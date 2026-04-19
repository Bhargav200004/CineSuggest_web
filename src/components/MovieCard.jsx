import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Star, Tag } from 'lucide-react'

function MovieCard({ movie, onFavoriteToggle, onRate, isFavorite: propIsFavorite, userRating: propUserRating }) {
  const navigate = useNavigate()
  // Sync local state with props when they change (for persistence after reload)
  const [isFavorite, setIsFavorite] = useState(propIsFavorite ?? movie.is_favorite ?? false)
  const [userRating, setUserRating] = useState(propUserRating ?? movie.user_rating ?? 0)

  // Update local state when props change
  useEffect(() => {
    setIsFavorite(propIsFavorite ?? movie.is_favorite ?? false)
  }, [propIsFavorite, movie.is_favorite])

  useEffect(() => {
    setUserRating(propUserRating ?? movie.user_rating ?? 0)
  }, [propUserRating, movie.user_rating])

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`)
  }

  const handleFavoriteClick = async (e) => {
    e.stopPropagation()
    const newFavoriteState = !isFavorite
    setIsFavorite(newFavoriteState)
    
    if (onFavoriteToggle) {
      await onFavoriteToggle(movie.id, newFavoriteState)
    }
  }

  const handleRate = async (e, rating) => {
    e.stopPropagation()
    setUserRating(rating)
    if (onRate) {
      await onRate(movie.id, rating)
    }
  }

  const posterUrl = movie.poster_path || '/api/placeholder/300/450'
  const title = movie.title || 'Untitled'
  const rating = movie.vote_average || 0
  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : null

  return (
    <div 
      className="group relative bg-surface rounded-xl overflow-hidden transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={posterUrl} 
          alt={title}
          className="w-full h-full object-cover transition-opacity duration-300"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzFBMjIzNSIvPjx0ZXh0IHg9IjE1MCIgeT0iMjI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIFBvc3RlcjwvdGV4dD48L3N2Zz4='
          }}
        />
        
        {/* Enhanced Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2.5 rounded-xl transition-all duration-300 transform hover:scale-110 ${
            isFavorite 
              ? 'bg-coral text-white shadow-lg shadow-coral/30 backdrop-blur-sm' 
              : 'bg-black/60 text-white hover:bg-coral/80 backdrop-blur-sm'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'fill-current scale-110' : ''}`} 
          />
        </button>

        {/* Rating Badge */}
        {rating > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 text-mint fill-mint" />
            <span className="text-sm font-medium text-off-white">
              {rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-off-white font-semibold text-base line-clamp-2 mb-2 min-h-[2.5rem]">
          {title}
        </h3>
        
        {/* Genre Tags - Below Title */}
        {movie.genre && (
          <div className="flex flex-wrap gap-1 mb-2">
            {movie.genre.split('|').slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-mint/10 text-mint text-xs rounded-full font-medium"
              >
                {genre.trim()}
              </span>
            ))}
            {movie.genre.split('|').length > 2 && (
              <span className="px-2 py-0.5 bg-surface text-soft-gray text-xs rounded-full">
                +{movie.genre.split('|').length - 2}
              </span>
            )}
          </div>
        )}
        
        {/* Release Date and Rating */}
        <div className="flex items-center justify-between">
          {releaseYear && (
            <span className="text-soft-gray text-sm">
              {releaseYear}
            </span>
          )}
          
          {/* TMDB Rating Badge */}
          {rating > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-mint/10 rounded-lg">
              <Star className="w-3 h-3 text-mint fill-mint" />
              <span className="text-sm font-medium text-mint">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieCard
