import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

export const Onboarding = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-800 to-blue-900 text-white px-6">
      {/* Encabezado */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-6 drop-shadow-lg">
        Bienvenido al chat para informáticos
      </h1>
      <p className="text-center text-lg md:text-2xl text-white/80 mb-10 max-w-5xl">
        La plataforma de chat diseñada para estudiantes y desarrolladores. Con
        canales, hilos, chatbots y automatizaciones que facilitan tu flujo de
        trabajo y colaboración.
      </p>

      {/* Beneficios generales */}
      <Card className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-3xl w-full text-center mb-10">
        <ul className="space-y-4 text-white/90 text-lg">
          <li>💬 Comunicación rápida y organizada por canales y hilos</li>
          <li>
            🤖 Bots inteligentes para tareas, cálculos y consultas académicas
          </li>
          <li>📂 Archivos y búsqueda avanzada en segundos</li>
          <li>👥 Estado de presencia y colaboración en tiempo real</li>
          <li>🛡️ Moderación y control de contenido automático</li>
        </ul>
      </Card>

      {/* Botones de acción */}
      <div className="flex flex-col md:flex-row gap-6">
        <Button
          variant="default"
          size="lg"
          className="px-12 py-4 bg-blue-700 hover:bg-blue-800"
          onClick={() => navigate('/register')}
        >
          Unirse ahora
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="px-12 py-4 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white transition-colors"
          onClick={() => navigate('/login')}
        >
          Iniciar sesión
        </Button>
      </div>
    </div>
  )
}
