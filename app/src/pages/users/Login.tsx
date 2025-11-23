'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Link } from 'react-router-dom'
import { H1, P } from '@/components/ui/typography'
import { toast } from 'sonner'

import {
  loginUser,
  type LoginDTO,
  getMe,
  type UserProfile,
} from '../../services/users'

const DEBUG = false // <- si quieres usar perfil de prueba

export const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)

    try {
      if (DEBUG) {
        // perfil de prueba
        const dummyProfile: UserProfile = {
          id: 'ea4bf86d-1007-49da-8c3a-650aebb2d185',
          email: 'prueba@prueba.cl',
          username: 'pruebaprueba',
          full_name: 'prueba prueba prueba',
          is_active: true,
        }
        console.log('Perfil (debug):', dummyProfile)
        toast.success(`Bienvenido ${dummyProfile.full_name}`)
        setLoading(false)
        return
      }

      const body: LoginDTO = {
        username_or_email: usernameOrEmail,
        password,
      }

      const loginResp = await loginUser(body)
      if (!loginResp) throw new Error('Error de login')

      // loginResp ya tiene { access_token, token_type }
      console.log('Respuesta login:', loginResp)

      localStorage.setItem('token', loginResp.access_token)

      // ahora sí puedes usar el token para getMe
      const profile = await getMe(loginResp.access_token)
      if (!profile) throw new Error('No se pudo obtener perfil')

      console.log('Perfil:', profile)
      toast.success(`Bienvenido ${profile.full_name}`)
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
