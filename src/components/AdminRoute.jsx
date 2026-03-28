import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { user } = useAuth()
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL

  // Session still hydrating
  if (user === undefined) return null

  if (!user || user.email !== adminEmail) {
    return <Navigate to="/" replace />
  }

  return children
}
