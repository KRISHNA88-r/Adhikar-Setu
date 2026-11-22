
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Check from './pages/Check'
import Results from './pages/Results'
import Schemes from './pages/Schemes'
import SchemeDetail from './pages/SchemeDetail'
import Scam from './pages/Scam'
import Notice from './pages/Notice'
import Assistant from './pages/Assistant'
import Privacy from './pages/Privacy'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Guide from './pages/Guide'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/check" element={<Check />} />
          <Route path="/results" element={<Results />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/schemes/:slug" element={<SchemeDetail />} />
          <Route path="/scam" element={<Scam />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/guide" element={<ProtectedRoute><Guide /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
