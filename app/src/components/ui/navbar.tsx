import { Link, useNavigate } from 'react-router-dom'
import { Button } from './button'
import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

export const Navbar = () => {
  const navigate = useNavigate()

  const { user, logout } = useContext(AuthContext)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center shadow-md bg-white">
      <Link to="/administrador">
        <h1 className="text-2xl font-bold text-blue-800">CHAT USM</h1>
      </Link>

      <div className="flex flex-row gap-4 items-center">
        {user ? (
          <>
            <Link to="/home">
              <Button variant="outline" size="sm">
                Canales
              </Button>
            </Link>
            <Link to="/chatbots">
              <Button variant="outline" size="sm">
                Chatbots
              </Button>
            </Link>
            <Link to="/perfil">
              <Button variant="outline" size="sm">
                Mi perfil
              </Button>
            </Link>

            <span className="text-gray-700 font-medium">
              Hola, {user.full_name}
            </span>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>

            <Link to="/register">
              <Button>Registro</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
