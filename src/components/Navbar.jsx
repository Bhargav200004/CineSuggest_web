import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Film, LogOut, User, Heart, Settings } from 'lucide-react'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-mint/10 rounded-lg">
              <Film className="w-6 h-6 text-mint" />
            </div>
            <span className="text-xl font-semibold text-off-white">
              CineSuggest
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            {/* User Stats */}
            <div className="hidden md:flex items-center gap-4 text-sm text-soft-gray">
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-coral" />
                <span>{user?.total_favorites || 0} favorites</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-mint" />
                <span>{user?.total_ratings || 0} rated</span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 pl-6 border-l border-surface">
              {/* Profile Link */}
              <Link
                to="/profile"
                className="flex items-center gap-3 hover:bg-surface/50 rounded-lg p-1 -ml-1 transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-off-white">
                    {user?.full_name || user?.username}
                  </p>
                  <p className="text-xs text-soft-gray">
                    {user?.email}
                  </p>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-mint" />
                </div>
              </Link>

              {/* Settings/Profile Button */}
              <Link
                to="/profile"
                className="p-2 text-soft-gray hover:text-mint transition-colors rounded-lg hover:bg-mint/10"
                title="Profile"
              >
                <Settings className="w-5 h-5" />
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 text-soft-gray hover:text-coral transition-colors rounded-lg hover:bg-coral/10"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
