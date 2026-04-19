// RecommendedTab.jsx - Personalized recommendations
import MovieCard from '../MovieCard'
import { Loader2, ThumbsUp, Sparkles, LogIn } from 'lucide-react'

function RecommendedTab({
  recommendations,
  loading,
  refetchRecommendations,
  toggleFavorite,
  rateMovie,
  user
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-6 h-6 text-mint" />
          <h2 className="text-2xl font-bold text-off-white">
            Recommended For You
          </h2>
        </div>
        <button
          onClick={refetchRecommendations}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-mint text-background font-medium rounded-lg hover:bg-mint/90 transition-colors disabled:opacity-50"
        >
          <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      <p className="text-soft-gray mb-6">
        Personalized recommendations based on your ratings and favorites.
      </p>
      
      {!user ? (
        <div className="text-center py-16">
          <LogIn className="w-12 h-12 text-mint mx-auto mb-4" />
          <h3 className="text-lg font-medium text-off-white mb-2">
            Login Required
          </h3>
          <p className="text-soft-gray max-w-md mx-auto">
            Please log in to see personalized recommendations based on your ratings and favorites.
          </p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-mint animate-spin" />
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {recommendations.map((movie) => (
            <MovieCard
              key={`rec-${movie.id}`}
              movie={movie}
              onFavoriteToggle={toggleFavorite}
              onRate={rateMovie}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Sparkles className="w-12 h-12 text-mint mx-auto mb-4" />
          <h3 className="text-lg font-medium text-off-white mb-2">
            No recommendations yet
          </h3>
          <p className="text-soft-gray max-w-md mx-auto">
            Start rating and favoriting movies to get personalized recommendations!
          </p>
        </div>
      )}
    </div>
  )
}

export default RecommendedTab
