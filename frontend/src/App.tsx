import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import AdminLogin from './pages/AdminLogin'
import Home from './Home'
import AdminDashboard from './pages/AdminDashboard'
import Register from './pages/Register'
import Login from './pages/Login'
import Account from './pages/Account'
import Messages from './pages/Messages'

function AdminRoute() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null)
      setLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    let active = true

    async function verifyAdmin() {
      if (!supabase || !userId) {
        setAuthorized(false)
        setLoading(false)
        return
      }

      setLoading(true)

      const { data, error } = await supabase.rpc('is_site_admin')

      if (active) {
        setAuthorized(!error && data === true)
        setLoading(false)
      }
    }

    verifyAdmin()

    return () => {
      active = false
    }
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#d4af37] grid place-items-center">
        Verifying Admin Access...
      </div>
    )
  }

  if (!authorized) return <Navigate to="/admin" replace />

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
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
