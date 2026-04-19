// RandomTab.jsx - Random movie discovery
import MovieCard from '../MovieCard'
import { Loader2, Shuffle, Compass } from 'lucide-react'

function RandomTab({
  randomMovies,
  loading,
  refetchRandom,
  toggleFavorite,
  rateMovie
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-mint" />
          <h2 className="text-2xl font-bold text-off-white">
            Discover Random Movies
          </h2>
        </div>
        <button
          onClick={refetchRandom}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-mint text-background font-medium rounded-lg hover:bg-mint/90 transition-colors disabled:opacity-50"
        >
          <Shuffle className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Shuffle Again
        </button>
      </div>
      
      <p className="text-soft-gray mb-6">
        Get a fresh batch of random movies every time you shuffle. Find hidden gems!
      </p>
      
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-mint animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {randomMovies.map((movie) => (
            <MovieCard
              key={`random-${movie.id}`}
              movie={movie}
              onFavoriteToggle={toggleFavorite}
              onRate={rateMovie}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default RandomTab
