import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import AdminLogin from './pages/AdminLogin'
import Home from './Home'
import AdminDashboard from './pages/AdminDashboard'

function AdminRoute() {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(!!data.session)
      setLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  if (loading) return <div className="min-h-screen bg-black text-[#d4af37] grid place-items-center">Loading...</div>
  if (!authenticated) return <Navigate to="/admin" replace />

  return (
    <AdminDashboard
      onLogout={async () => {
        await supabase?.auth.signOut()
        window.location.href = '/admin'
      }}
    />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminRoute />} />
      </Routes>
    </BrowserRouter>
  )
}
