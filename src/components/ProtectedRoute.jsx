import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Shows a pulsing skeleton screen while the session is hydrating,
// redirects to /login if unauthenticated, renders children if authenticated.
export default function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (user === undefined) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col gap-3 w-64">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-3 bg-[#1a1a1a] animate-pulse"
              style={{ width: `${[100, 75, 90, 60][i]}%`, animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </main>
    )
  }

  if (user === null) {
    return <Navigate to="/login" replace />
  }

  return children
}
