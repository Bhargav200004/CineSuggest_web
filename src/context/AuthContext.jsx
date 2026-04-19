// AuthContext - Thin wrapper that delegates to useAuth hook
// Maintains backward compatibility while following SOLID principles
// All business logic has been moved to: src/hooks/useAuth.js
// Services: src/services/apiService.js, src/services/authService.js

import { AuthProvider, useAuthContext } from '../hooks/useAuth.jsx'

// Re-export for backward compatibility
export const useAuth = useAuthContext
export { AuthProvider }
export default AuthProvider
