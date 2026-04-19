// Pagination Component - Pure UI for pagination controls
import { ChevronLeft, ChevronRight } from 'lucide-react'

function Pagination({ 
  page, 
  hasMore, 
  total,
  onPrev, 
  onNext,
  loading = false 
}) {
  const showTotal = total > 0

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={onPrev}
        disabled={page <= 1 || loading}
        className="flex items-center gap-2 px-4 py-2 bg-surface text-off-white rounded-xl 
                   hover:bg-surface/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
        Previous
      </button>

      <div className="flex items-center gap-2">
        <span className="px-4 py-2 bg-mint/10 text-mint font-medium rounded-xl">
          Page {page}
        </span>
        {showTotal && (
          <span className="text-soft-gray text-sm">
            of {Math.ceil(total / 20)}
          </span>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={!hasMore || loading}
        className="flex items-center gap-2 px-4 py-2 bg-surface text-off-white rounded-xl 
                   hover:bg-surface/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

export default Pagination
