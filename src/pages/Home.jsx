// Home.jsx - Main page with tab navigation
// Tab content extracted to separate components for maintainability

import { useState, useEffect, useMemo, useRef } from 'react'
import { useMovies, useRandomMovies, useRecommendations } from '../hooks/useMovies'
import { useInteractions, useUserFavorites } from '../hooks/useInteractions'
import { usePagination } from '../hooks/usePagination'
import { useAuthContext } from '../hooks/useAuth'
import { BrowseTab, RandomTab, RecommendedTab } from '../components/tabs'
import { Search, Grid3X3, Compass, ThumbsUp, X, Calendar, TrendingUp } from 'lucide-react'

function Home() {
  // Hooks
  const { page, limit, hasMore, setHasMore, nextPage, prevPage, reset } = usePagination(1, 20)
  const skip = (page - 1) * limit
  const { movies: apiMovies, loading, error, filters, fetchMovies, searchMovies, updateFilters } = useMovies(skip, limit)
  const { toggleFavorite, rateMovie } = useInteractions()
  const { movies: randomMovies, loading: randomLoading, refetch: refetchRandom } = useRandomMovies(12)
  const { recommendations, loading: recLoading, refetch: refetchRecommendations } = useRecommendations(12)
  const { user } = useAuthContext()
  const { favorites, fetchFavorites } = useUserFavorites()

  // UI State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMode, setSearchMode] = useState(false)
  const [activeTab, setActiveTab] = useState('browse')
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  const filterDrawerRef = useRef(null)

  // Fetch favorites on mount to know which movies are favorited
  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  // Merge movies with favorite status
  const moviesWithFavorites = useMemo(() => {
    const favoriteIds = new Set(favorites.map(f => f.id))
    return apiMovies.map(movie => ({
      ...movie,
      is_favorite: favoriteIds.has(movie.id)
    }))
  }, [apiMovies, favorites])

  // Update hasMore when movies change
  useEffect(() => {
    if (apiMovies.length > 0) {
      setHasMore(apiMovies.length === limit)
    }
  }, [apiMovies, limit, setHasMore])

  // Close filter drawer on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDrawerRef.current && !filterDrawerRef.current.contains(event.target)) {
        setShowFilterDrawer(false)
      }
    }

    if (showFilterDrawer) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showFilterDrawer])

  // Handlers
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

  const handleFavoriteToggle = async (movieId, isFavorite) => {
    await toggleFavorite(movieId, isFavorite)
  }

  const handleRate = async (movieId, rating) => {
    await rateMovie(movieId, rating)
  }

  // Tab config
  const tabs = [
    { id: 'browse', label: 'Browse', icon: Grid3X3 },
    { id: 'random', label: 'Random', icon: Compass },
    { id: 'recommended', label: 'For You', icon: ThumbsUp },
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-off-white mb-2">Discover Movies</h1>
          <p className="text-soft-gray">Explore and rate your favorite films</p>
        </div>

        {/* Search and Filters - Full Width Horizontal */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            {/* Search Bar - Full Width */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search movies by title, genre, or year..."
                className="w-full pl-12 pr-32 py-3 bg-surface border border-surface rounded-xl text-off-white placeholder-soft-gray focus:outline-none focus:border-mint transition-colors"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                {searchMode && (
                  <button
                    onClick={handleClearSearch}
                    className="px-3 py-1.5 text-soft-gray text-sm hover:text-off-white transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-4 py-1.5 bg-mint text-background text-sm font-medium rounded-lg hover:bg-mint/90 transition-colors disabled:opacity-50"
                >
                  Search
                </button>
              </div>
            </div>
            
            {/* Filter Buttons - Right Side */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  reset()
                  updateFilters({})
                }}
                className="px-4 py-3 bg-surface text-off-white rounded-xl hover:bg-surface/80 transition-colors font-medium text-sm"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                className="px-4 py-3 bg-mint text-background rounded-xl hover:bg-mint/90 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <Grid3X3 className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-coral/10 border border-coral/20 rounded-xl text-coral text-sm">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-surface pb-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === id
                  ? 'bg-mint text-background'
                  : 'text-soft-gray hover:text-off-white hover:bg-surface'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Filter Drawer */}
        {showFilterDrawer && (
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilterDrawer(false)}>
            <div 
              ref={filterDrawerRef}
              className="absolute right-0 top-0 h-full w-80 bg-surface shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-off-white">Filters</h2>
                  <button
                    onClick={() => setShowFilterDrawer(false)}
                    className="p-2 text-soft-gray hover:text-off-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Quick Filter Options */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-off-white mb-2">Sort By</label>
                    <select
                      value={filters.sortBy || 'popularity'}
                      onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-surface rounded-lg text-off-white focus:outline-none focus:border-mint"
                    >
                      <option value="popularity">Popularity</option>
                      <option value="vote_average">Rating</option>
                      <option value="release_date">Release Date</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-off-white mb-2">Sort Order</label>
                    <select
                      value={filters.sortOrder || 'desc'}
                      onChange={(e) => handleFilterChange({ ...filters, sortOrder: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-surface rounded-lg text-off-white focus:outline-none focus:border-mint"
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-off-white mb-2">Min Rating</label>
                    <select
                      value={filters.minRating || 0}
                      onChange={(e) => handleFilterChange({ ...filters, minRating: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-background border border-surface rounded-lg text-off-white focus:outline-none focus:border-mint"
                    >
                      <option value={0}>Any Rating</option>
                      <option value={7}>7+ Stars</option>
                      <option value={8}>8+ Stars</option>
                      <option value={9}>9+ Stars</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-off-white mb-2">Year</label>
                    <input
                      type="number"
                      value={filters.year || ''}
                      onChange={(e) => handleFilterChange({ ...filters, year: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="e.g., 2023"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-3 py-2 bg-background border border-surface rounded-lg text-off-white placeholder-soft-gray focus:outline-none focus:border-mint"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-surface">
                    <button
                      onClick={() => {
                        reset()
                        updateFilters({})
                        setShowFilterDrawer(false)
                      }}
                      className="w-full px-4 py-2 bg-surface text-off-white rounded-lg hover:bg-surface/80 transition-colors font-medium"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'browse' && (
          <BrowseTab
            apiMovies={moviesWithFavorites}
            loading={loading}
            error={error}
            filters={filters}
            fetchMovies={fetchMovies}
            searchMovies={searchMovies}
            updateFilters={handleFilterChange}
            searchQuery={searchQuery}
            searchMode={searchMode}
            setSearchMode={setSearchMode}
            setSearchQuery={setSearchQuery}
            toggleFavorite={handleFavoriteToggle}
            rateMovie={handleRate}
            page={page}
            limit={limit}
            hasMore={hasMore}
            setHasMore={setHasMore}
            nextPage={nextPage}
            prevPage={prevPage}
            reset={reset}
          />
        )}

        {activeTab === 'random' && (
          <RandomTab
            randomMovies={randomMovies}
            loading={randomLoading}
            refetchRandom={refetchRandom}
            toggleFavorite={handleFavoriteToggle}
            rateMovie={handleRate}
          />
        )}

        {activeTab === 'recommended' && (
          <RecommendedTab
            recommendations={recommendations}
            loading={recLoading}
            refetchRecommendations={refetchRecommendations}
            toggleFavorite={handleFavoriteToggle}
            rateMovie={handleRate}
            user={user}
          />
        )}
      </main>
    </div>
  )
}

export default Home
