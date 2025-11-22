import { Link } from 'react-router-dom'
import { Button } from './button'

export const Navbar = () => {
  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">CHAT USM</h1>
      <div className="flex flex-row gap-4">
        <Link to="/login">
          <Button variant="outline">Login</Button>
        </Link>

        <Link to="/register">
          <Button>Registro</Button>
        </Link>
      </div>
    </nav>
  )
}
