import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Onboarding } from './pages/Onboarding'
import { Layout } from './components/Layout'
import { Login } from './pages/users/Login'
import { Profile } from './pages/users/Profile'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { GuestRoute } from './routes/GuestRoute'
import { Toaster } from '@/components/ui/sonner'
function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Router>
        <Routes>
          {/* Rutas públicas para usuarios no autenticados */}
          <Route
            path="/"
            element={
              <GuestRoute>
                <Onboarding />
              </GuestRoute>
            }
          />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />

          {/* Rutas protegidas dentro del Layout */}
          <Route element={<Layout />}>
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
