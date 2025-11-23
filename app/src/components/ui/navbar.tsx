import { Link } from 'react-router-dom'
import { Button } from './button'
import type { UserProfile } from '../../services/users'

interface NavbarProps {
  user?: UserProfile | null
  setUser?: React.Dispatch<React.SetStateAction<UserProfile | null>>
}

export const Navbar = ({ user, setUser }: NavbarProps) => {
  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser?.(null)
  }

  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center shadow-md bg-white">
      <h1 className="text-2xl font-bold text-blue-800">CHAT USM</h1>

      <div className="flex flex-row gap-4 items-center">
        {user ? (
          <>
            <span className="text-gray-700 font-medium">Hola, {user.full_name}</span>
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
