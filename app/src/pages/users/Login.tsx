import { useContext, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Link, useNavigate } from 'react-router-dom'
import { H1, P } from '@/components/ui/typography'
import { toast } from 'sonner'

import { loginUser, type LoginDTO, getMe } from '../../services/users'
import { AuthContext } from '@/context/AuthContext'

export const Login = () => {
  const navigate = useNavigate()

  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useContext(AuthContext)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)

    try {
      const body: LoginDTO = {
        username_or_email: usernameOrEmail,
        password,
      }

      const tokenData = await loginUser(body)
      if (!tokenData) throw new Error('Error de login')

      const profile = await getMe(tokenData.access_token)
      if (!profile) throw new Error('Error de login')

      toast.success(`Bienvenido ${profile.full_name}`, {
        position: 'top-right',
      })

      login(profile, tokenData)

      navigate('/home')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl">
        <CardHeader className="text-center py-6">
          <H1 className="text-gray-800">Bienvenido de nuevo</H1>
          <P className="mt-2 text-gray-500 text-sm">
            Ingresa tu cuenta para continuar
          </P>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col space-y-1">
              <Label
                htmlFor="usernameOrEmail"
                className="font-medium text-gray-700"
              >
                Correo electrónico o Usuario
              </Label>
              <Input
                id="usernameOrEmail"
                type="text"
                placeholder="ejemplo@correo.com o usuario"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-gray-700"
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Entrar'}
            </Button>
          </form>

          <Separator className="my-5" />

          <div className="flex justify-between text-sm text-gray-500">
            <Link to="/forgot-password" className="hover:text-indigo-600">
              ¿Olvidaste tu contraseña?
            </Link>
            <Link to="/register" className="hover:text-indigo-600">
              Crear cuenta
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
