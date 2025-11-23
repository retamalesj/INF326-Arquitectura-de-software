import { Outlet } from 'react-router-dom'
import { Navbar } from './ui/navbar'
import { useEffect, useState } from 'react'
import { getMe, type UserProfile } from '../services/users'

export const Layout = () => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) return
    getMe(token).then(setUser)
  }, [token])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <Navbar user={user} setUser={setUser} />

      {/* Contenido principal */}
      <main className="flex-1 px-6 py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 text-center bg-blue-700">
        <span className="text-white/90 text-sm">
          © 2025 Mi Chat. Todos los derechos reservados.
        </span>
      </footer>
    </div>
  )
}