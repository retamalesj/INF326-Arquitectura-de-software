import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

interface GuestRouteProps {
  children: React.ReactNode
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { user, loading } = useContext(AuthContext)

  if (loading) return <p>Cargando...</p>

  if (user) {
    // Si ya está logueado, redirige al home
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}
