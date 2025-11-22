import { useEffect, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { H1, P } from '@/components/ui/typography'
import { API_GATEWAY_URL } from '@/constants'

const DEBUG = true
/** ---------------- GET ME ---------------- */
export interface UserProfile {
  id: string
  email: string
  username: string
  full_name: string
  is_active: boolean
}

export const getMe = async (token: string): Promise<UserProfile | null> => {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.status === 401) throw new Error('No autorizado')
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)

    return await response.json()
  } catch (error) {
    console.error('Error obteniendo perfil de usuario:', error)
    return null
  }
}

/** ---------------- COMPONENTE PROFILE ---------------- */
export const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null)

  const token = localStorage.getItem('token') || ''

  // Perfil falso para modo DEBUG
  const fakeUser: UserProfile = {
    id: '123',
    email: 'usuario@correo.com',
    username: 'debug_user',
    full_name: 'Usuario de Prueba',
    is_active: true,
  }

  useEffect(() => {
    if (DEBUG) {
      setUser(fakeUser)
      return
    }

    if (!token) return
    getMe(token).then(setUser)
  }, [token])

  if (!user) return <P>Cargando perfil...</P>

  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      {/* Avatar con borde degradado */}
      <div className="w-28 h-28 border-4 rounded-full bg-gradient-to-tr from-teal-400 via-blue-500 to-purple-500 p-1">
        <Avatar className="w-full h-full">
          <AvatarImage
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.full_name,
            )}&background=0D8ABC&color=fff`}
            alt={user.full_name}
          />
          <AvatarFallback>
            {user.full_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Nombre y email */}
      <div className="flex flex-col items-center text-center space-y-1">
        <H1>{user.full_name}</H1>
        <P className="text-gray-500 text-sm">{user.email}</P>
      </div>

      {/* Estado */}
      <Badge
        className={`px-3 py-1 rounded-full text-xs ${
          user.is_active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
        }`}
      >
        {user.is_active ? 'Online' : 'Offline'}
      </Badge>

      {/* Texto DEBUG visible si está activo */}
      {DEBUG && (
        <P className="text-xs text-yellow-400 mt-2">
          (DEBUG MODE — perfil simulado)
        </P>
      )}
    </div>
  )
}
