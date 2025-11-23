import { createContext, useState, useEffect } from 'react'

// Definimos la interfaz del usuario
interface User {
  id: string
  email: string
  username: string
  full_name: string
  is_active: boolean
}

// Definimos la interfaz del token
interface TokenData {
  access_token: string
  token_type: string
}

// Definimos la interfaz del contexto
interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (userData: User, tokenData: TokenData) => void
  logout: () => void
}

// Props del proveedor
interface AuthProviderProps {
  children: React.ReactNode
}

// Crear el contexto con tipo
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
})

// Proveedor del contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
    setLoading(false)
  }, [])

  // Función para iniciar sesión
  const login = (userData: User, tokenData: TokenData) => {
    setUser(userData)
    setToken(tokenData.access_token)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', tokenData.access_token)
  }

  // Función para cerrar sesión
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
