import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useContext(AuthContext)

  if (loading) return <p>Cargando...</p> // opcional mientras carga

  if (!user) {
    // Si no hay usuario, redirige al login
    return <Navigate to="/login" replace />
  }

  // Si hay usuario, renderiza el componente
  return <>{children}</>
}
