// FilterBar.jsx - Movie filter controls
import { useState, useEffect } from 'react'
import { Filter, X, SlidersHorizontal } from 'lucide-react'

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
  'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'
]

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' },
  { value: 'release_date', label: 'Release Date' },
  { value: 'title', label: 'Title' },
]

function FilterBar({ filters, onFiltersChange, loading }) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  // Sync local filters with parent
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleGenreChange = (genre) => {
    setLocalFilters(prev => ({
      ...prev,
      genre: prev.genre === genre ? '' : genre
    }))
  }

  const handleYearChange = (e) => {
    const year = e.target.value
    setLocalFilters(prev => ({
      ...prev,
      year: year ? parseInt(year) : ''
    }))
  }

  const handleMinRatingChange = (e) => {
    const rating = e.target.value
    setLocalFilters(prev => ({
      ...prev,
      minRating: rating ? parseFloat(rating) : ''
    }))
  }

  const handleSortChange = (sortBy) => {
    setLocalFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }))
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
    setIsOpen(false)
  }

  const clearFilters = () => {
    const empty = {}
    setLocalFilters(empty)
    onFiltersChange(empty)
  }

  const hasActiveFilters = filters.genre || filters.year || filters.minRating

  return (
    <div className="mb-6">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          hasActiveFilters
            ? 'bg-mint text-background'
            : 'bg-surface text-off-white hover:bg-surface/80'
        }`}
        disabled={loading}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {hasActiveFilters && (
          <span className="ml-1 text-xs bg-background/20 px-2 py-0.5 rounded-full">
            {[filters.genre, filters.year, filters.minRating].filter(Boolean).length}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="mt-4 p-4 bg-surface rounded-xl border border-soft-gray/20">
          {/* Genre Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-off-white mb-2">
              Genre
            </label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(genre => (
                <button
                  key={genre}
                  onClick={() => handleGenreChange(genre)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    localFilters.genre === genre
                      ? 'bg-mint text-background'
                      : 'bg-background text-soft-gray hover:text-off-white'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Year & Rating Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-off-white mb-2">
                Year
              </label>
              <select
                value={localFilters.year || ''}
                onChange={handleYearChange}
                className="w-full px-3 py-2 bg-background border border-soft-gray/20 rounded-lg text-off-white focus:outline-none focus:border-mint"
              >
                <option value="">All Years</option>
                {Array.from({ length: 50 }, (_, i) => 2024 - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-off-white mb-2">
                Minimum Rating
              </label>
              <select
                value={localFilters.minRating || ''}
                onChange={handleMinRatingChange}
                className="w-full px-3 py-2 bg-background border border-soft-gray/20 rounded-lg text-off-white focus:outline-none focus:border-mint"
              >
                <option value="">Any Rating</option>
                {[9, 8, 7, 6, 5, 4, 3, 2, 1].map(rating => (
                  <option key={rating} value={rating}>{rating}+ Stars</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-off-white mb-2">
              Sort By
            </label>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${
                    localFilters.sortBy === option.value
                      ? 'bg-mint text-background'
                      : 'bg-background text-soft-gray hover:text-off-white'
                  }`}
                >
                  {option.label}
                  {localFilters.sortBy === option.value && (
                    <span className="text-xs">
                      {localFilters.sortOrder === 'desc' ? '↓' : '↑'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-soft-gray/20">
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-coral hover:text-coral/80 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm text-soft-gray hover:text-off-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyFilters}
                disabled={loading}
                className="px-4 py-2 bg-mint text-background text-sm font-medium rounded-lg hover:bg-mint/90 transition-colors disabled:opacity-50"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Tags */}
      {hasActiveFilters && !isOpen && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-soft-gray">Active:</span>
          {filters.genre && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-mint/10 text-mint text-xs rounded-lg">
              {filters.genre}
              <button
                onClick={() => handleGenreChange(filters.genre)}
                className="hover:text-coral"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.year && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-mint/10 text-mint text-xs rounded-lg">
              {filters.year}
              <button
                onClick={() => setLocalFilters(prev => ({ ...prev, year: '' })) || onFiltersChange({ ...filters, year: '' })}
                className="hover:text-coral"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.minRating && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-mint/10 text-mint text-xs rounded-lg">
              {filters.minRating}+ ★
              <button
                onClick={() => setLocalFilters(prev => ({ ...prev, minRating: '' })) || onFiltersChange({ ...filters, minRating: '' })}
                className="hover:text-coral"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default FilterBar
