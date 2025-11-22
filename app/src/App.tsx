import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Onboarding } from './pages/Onboarding'
import { Layout } from './components/Layout'
import { Login } from './pages/users/Login'
import { Profile } from './pages/users/Profile'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/perfil" element={<Profile />} />
          <Route path="/home" element={<Onboarding />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
