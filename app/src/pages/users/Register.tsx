import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Link, useNavigate } from 'react-router-dom'
import { H1, P } from '@/components/ui/typography'
import { registerUser, type RegisterDTO } from '@/services/users'
import { toast } from 'sonner'

export const Register = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres')
      return
    }

    const body: RegisterDTO = {
      full_name: name,
      email,
      username: email.split('@')[0],
      password,
    }

    setLoading(true)
    const result = await registerUser(body)
    setLoading(false)

    if (result) {
      toast.success('Usuario registrado con éxito!')
      navigate('/login')
    } else {
      toast.error('Hubo un error registrando el usuario')
    }
  }

  // Tipado del evento de input change
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value)
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl">
        <CardHeader className="text-center py-6">
          <H1 className="text-gray-800">Crea tu cuenta</H1>
          <P className="mt-2 text-gray-500 text-sm">
            Regístrate para empezar a usar la aplicación
          </P>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="name" className="font-medium text-gray-700">
                Nombre completo
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={handleInputChange(setName)}
                required
                className="text-gray-700"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <Label htmlFor="email" className="font-medium text-gray-700">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={handleInputChange(setEmail)}
                required
                className="text-gray-700"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <Label htmlFor="password" className="font-medium text-gray-700">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={handleInputChange(setPassword)}
                required
                className="text-gray-700"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <Label
                htmlFor="confirmPassword"
                className="font-medium text-gray-700"
              >
                Confirmar contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={handleInputChange(setConfirmPassword)}
                required
                className="text-gray-700"
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </form>

          <Separator className="my-5" />

          <div className="flex justify-between text-sm text-gray-500">
            <Link to="/login" className="hover:text-indigo-600">
              Ya tienes una cuenta? Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
