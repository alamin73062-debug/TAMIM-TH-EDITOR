import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Mail, LockKeyhole, LogIn, Loader2, ArrowLeft } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!supabase) {
      setError('Supabase connection is not configured.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    navigate('/account')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-5 py-12 text-white">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#d4af37]">
          <ArrowLeft size={17} /> Back to Website
        </Link>

        <div className="rounded-3xl border border-[#d4af37]/25 bg-[#111]/90 p-8 shadow-2xl sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d4af37]/40 bg-[#d4af37]/10">
              <LogIn size={30} className="text-[#d4af37]" />
            </div>
            <h1 className="text-3xl font-black">
              MEMBER <span className="text-[#d4af37]">LOGIN</span>
            </h1>
            <p className="mt-3 text-sm text-gray-500">TAMIM TH. EDITOR — MEMBER ACCESS</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-300">Email Address</label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black px-4">
                <Mail size={18} className="text-[#d4af37]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent py-4 text-white outline-none placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">Password</label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black px-4">
                <LockKeyhole size={18} className="text-[#d4af37]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent py-4 text-white outline-none placeholder:text-gray-600"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] py-4 font-bold text-black disabled:opacity-60"
            >
              {loading ? <Loader2 size={19} className="animate-spin" /> : <LogIn size={18} />}
              {loading ? 'Signing In...' : 'Login'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#d4af37]">Create Account</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
