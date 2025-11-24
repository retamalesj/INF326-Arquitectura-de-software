import { useState, useEffect } from 'react'
import { Calculator as CalcIcon, Shield } from 'lucide-react'
import { API_GATEWAY_URL } from '@/constants'

export const CalculatorChatbot = () => {
  useEffect(() => {
    console.log('--- Componente Calculator MONTADO ---')
  }, [])

  const [query, setQuery] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [clickedMethod, setClickedMethod] = useState<
    'solve' | 'integrate' | 'derive' | null
  >(null)

  const handleCalculate = async (
    endpoint: 'solve' | 'integrate' | 'derive',
  ) => {
    setClickedMethod(endpoint)
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(
        `${API_GATEWAY_URL}/calculator/${endpoint}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Error al calcular')
      }

      if (data.solutions && data.solutions.length > 0) {
        // Para ecuaciones e integrales
        setResult(`${JSON.stringify(data.solutions)}`)
      } else if (data.result) {
        // Para derivadas
        setResult(`${data.result}`)
      } else {
        setResult(JSON.stringify(data, null, 2))
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full font-sans p-6 overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Calculadora Científica</h1>
        <p>Resuelve ecuaciones, derivadas e integrales.</p>
      </header>

      <div className="max-w-3xl rounded-xl border border-gray-700 shadow-2xl p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Expresión Matemática
          </label>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: x**2 - 25  o  sin(x)"
              className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg p-4 pl-4 text-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-500 font-mono"
              onKeyDown={(e) => e.key === 'Enter' && handleCalculate('solve')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => handleCalculate('solve')}
            disabled={loading || !query}
            className="flex justify-center items-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/20"
          >
            Resolver Ecuación
          </button>
          <button
            onClick={() => handleCalculate('integrate')}
            disabled={loading || !query}
            className="flex justify-center items-center py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/20"
          >
            Integrar ∫
          </button>
          <button
            onClick={() => handleCalculate('derive')}
            disabled={loading || !query}
            className="flex justify-center items-center py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/20"
          >
            Derivar d/dx
          </button>
        </div>

        <div className="mb-2 text-sm">
          {clickedMethod
            ? `Método seleccionado: ${clickedMethod === 'solve' ? 'Resolver Ecuación' : clickedMethod === 'integrate' ? 'Integrar ∫' : 'Derivar d/dx'}`
            : 'Selecciona un método para calcular'}
        </div>

        <div className="bg-gray-900 rounded-lg p-6 min-h-[120px] border border-gray-700 relative overflow-hidden">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Resultado
          </p>

          {loading ? (
            <div className="flex items-center gap-3 text-indigo-400 animate-pulse">
              <CalcIcon className="animate-spin" />
              <span>Procesando...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-900/30 border border-red-800 rounded text-red-200 flex items-start gap-3">
              <Shield size={20} className="shrink-0 mt-1" />
              <div>
                <p className="font-bold">Error</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          ) : result ? (
            <div className="font-mono text-2xl text-emerald-400 break-all">
              {result}
            </div>
          ) : (
            <p className="text-gray-600 italic">
              El resultado aparecerá aquí...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
