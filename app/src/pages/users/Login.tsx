import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Link } from 'react-router-dom'
import { H1, P } from '@/components/ui/typography'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log({ email, password })
    // Aquí iría tu lógica de login con API
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
              <Label htmlFor="email" className="font-medium text-gray-700">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            >
              Entrar
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
