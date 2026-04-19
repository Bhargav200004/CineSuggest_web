// Pagination hook - reusable pagination logic
import { useState, useCallback } from 'react'

export function usePagination(initialPage = 1, initialLimit = 20) {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)

  const nextPage = useCallback(() => {
    setPage(prev => prev + 1)
  }, [])

  const prevPage = useCallback(() => {
    setPage(prev => Math.max(1, prev - 1))
  }, [])

  const goToPage = useCallback((newPage) => {
    setPage(Math.max(1, newPage))
  }, [])

  const reset = useCallback(() => {
    setPage(1)
    setHasMore(true)
  }, [])

  const updatePagination = useCallback((itemsCount, totalItems) => {
    setHasMore(itemsCount === limit)
    if (totalItems) setTotal(totalItems)
  }, [limit])

  const skip = (page - 1) * limit

  return {
    page,
    limit,
    skip,
    hasMore,
    total,
    nextPage,
    prevPage,
    goToPage,
    setLimit,
    setHasMore,
    reset,
    updatePagination,
  }
}
