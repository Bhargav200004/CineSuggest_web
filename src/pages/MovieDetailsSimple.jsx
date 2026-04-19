// MovieDetailsSimple.jsx - Simplified version to debug blank screen issue
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Film } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('MovieDetails Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center">
            <Film className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-off-white mb-2">
              Something went wrong
            </h1>
            <p className="text-soft-gray mb-4">
              Error: {this.state.error?.message}
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-mint text-background rounded-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function MovieDetailsSimple() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  
  console.log('MovieDetailsSimple mounted with movieId:', movieId)
  console.log('Current URL:', window.location.href)
  
  if (!movieId) {
    console.error('No movieId found in URL params')
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Film className="w-16 h-16 text-soft-gray mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-off-white mb-2">
            No Movie ID
          </h1>
          <p className="text-soft-gray mb-4">
            No movie ID found in the URL
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-mint text-background rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <ErrorBoundary>
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
          
          {/* Debug Info */}
          <div className="p-6 bg-surface rounded-xl">
            <h1 className="text-2xl font-bold text-off-white mb-4">
              Movie Details Page - Working!
            </h1>
            <p className="text-soft-gray mb-2">
              Movie ID: {movieId}
            </p>
            <p className="text-soft-gray mb-2">
              Current URL: {window.location.href}
            </p>
            <p className="text-soft-gray">
              This is a simplified version to test if the page loads.
            </p>
            
            <button
              onClick={() => alert('Test button works!')}
              className="mt-4 px-4 py-2 bg-mint text-background rounded-lg"
            >
              Test JavaScript
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default MovieDetailsSimple
