import { useContext, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { H1, P } from '@/components/ui/typography'
import { AuthContext } from '@/context/AuthContext'
import { FiEdit, FiCheck, FiX } from 'react-icons/fi' // <-- React Icons
import { updateMe, type UpdateMeDTO } from '@/services/users'
import { toast } from 'sonner'

export const Profile = () => {
  const { user, updateUser, token } = useContext(AuthContext)
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(user?.full_name || '')

  if (!user) return <P>Cargando perfil...</P>

  const handleSave = async () => {
    if (!token) return

    const body: UpdateMeDTO = { full_name: fullName }
    const updatedUser = await updateMe(token, body)

    if (updatedUser) {
      updateUser(updatedUser.full_name)
      setIsEditing(false)
      toast.success('Se actualizó el nombre correctamente.')
    } else {
      toast.error('No se pudo actualizar el nombre')
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4 mt-8 w-full h-full">
      {/* Avatar con borde degradado */}
      <div className="w-28 h-28 border-4 rounded-full bg-gradient-to-tr from-teal-400 via-blue-500 to-purple-500 p-1">
        <Avatar className="w-full h-full">
          <AvatarImage
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              fullName,
            )}&background=0D8ABC&color=fff`}
            alt={fullName}
          />
          <AvatarFallback>
            {fullName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Nombre y email */}
      <div className="flex flex-col items-center text-center space-y-1">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border rounded-lg px-3 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg flex items-center"
            >
              <FiCheck className="w-5 h-5 mr-1" /> Guardar
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setFullName(user.full_name)
              }}
              className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-lg flex items-center"
            >
              <FiX className="w-5 h-5 mr-1" /> Cancelar
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <H1>{fullName}</H1>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-blue-500 transition"
              title="Editar nombre"
            >
              <FiEdit className="w-5 h-5" />
            </button>
          </div>
        )}
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
    </div>
  )
}
