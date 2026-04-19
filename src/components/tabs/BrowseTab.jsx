// BrowseTab.jsx - Browse movies with filters and pagination
import { useEffect } from 'react'
import MovieCard from '../MovieCard'
import Pagination from '../Pagination'
import FilterBar from '../FilterBar'
import { Loader2 } from 'lucide-react'
import { DUMMY_MOVIES } from '../../data/dummyMovies'

function BrowseTab({
  apiMovies,
  loading,
  error,
  filters,
  fetchMovies,
  searchMovies,
  updateFilters,
  searchQuery,
  searchMode,
  setSearchMode,
  setSearchQuery,
  toggleFavorite,
  rateMovie,
  page,
  limit,
  hasMore,
  setHasMore,
  nextPage,
  prevPage,
  reset
}) {
  const usingDummyData = apiMovies.length === 0
  const movies = apiMovies.length > 0 ? apiMovies : DUMMY_MOVIES


  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchMode(false)
      fetchMovies(0, limit, filters)
      return
    }
    setSearchMode(true)
    searchMovies(searchQuery)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSearchMode(false)
    reset()
    fetchMovies(0, limit, filters)
  }

  const handleFilterChange = (newFilters) => {
    reset()
    updateFilters(newFilters)
  }

  return (
    <>
      {/* Filter Bar - Hidden since filters are now in main header */}
      {/* {!searchMode && (
        <FilterBar
          filters={filters}
          onFiltersChange={handleFilterChange}
          loading={loading}
        />
      )} */}

      {/* Dummy Data Notice */}
      {usingDummyData && (
        <div className="mb-6 p-4 bg-mint/10 border border-mint/20 rounded-xl">
          <p className="text-mint text-sm">
            <span className="font-medium">Note:</span> Showing demo data. 
            Connect to your backend API to load real movies.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-mint animate-spin" />
        </div>
      )}

      {/* Movies Grid */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onFavoriteToggle={toggleFavorite}
              onRate={rateMovie}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !searchMode && movies.length > 0 && (
        <Pagination
          page={page}
          hasMore={hasMore}
          onPrev={prevPage}
          onNext={nextPage}
          loading={loading}
        />
      )}

      {/* Empty State */}
      {!loading && movies.length === 0 && (
        <div className="text-center py-16">
          <p className="text-soft-gray text-lg">
            No movies found. Try a different search.
          </p>
        </div>
      )}
    </>
  )
}

export default BrowseTab
