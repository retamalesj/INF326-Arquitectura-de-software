import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Onboarding } from './pages/Onboarding'
import { Layout } from './components/Layout'
import { Login } from './pages/users/Login'
import { Profile } from './pages/users/Profile'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { GuestRoute } from './routes/GuestRoute'
import { ModerationAdminPage } from './pages/admin/admin'
import { Home } from './pages/home'
import { Calculator } from './pages/Calculator' 

import { Toaster } from '@/components/ui/sonner'
import { Register } from './pages/users/Register'

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
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
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
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calculator"
              element={
                <ProtectedRoute>
                  <Calculator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <ModerationAdminPage />
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