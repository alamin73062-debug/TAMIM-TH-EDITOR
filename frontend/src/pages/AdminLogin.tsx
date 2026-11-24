import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { LockKeyhole, Mail, ArrowLeft, Loader2 } from 'lucide-react'

export default function AdminLogin() {
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
      email,
      password,
    })
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    window.location.href = '/admin/dashboard'
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-5 py-12 text-white">
      <div className="w-full max-w-md">
        <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#d4af37]">
          <ArrowLeft size={17} /> Back to Website
        </a>

        <div className="rounded-3xl border border-[#d4af37]/25 bg-[#111]/90 p-8 shadow-2xl sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d4af37]/40 bg-[#d4af37]/10">
              <LockKeyhole size={30} className="text-[#d4af37]" />
            </div>
            <h1 className="text-3xl font-black tracking-wide">
              ADMIN <span className="text-[#d4af37]">LOGIN</span>
            </h1>
            <p className="mt-3 text-sm text-gray-500">TAMIM TH. EDITOR — PRIVATE PANEL</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-300">Admin Email</label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black px-4">
                <Mail size={18} className="text-[#d4af37]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter admin email"
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
                  placeholder="Enter admin password"
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] py-4 font-bold text-black transition hover:bg-[#f1d77a] disabled:opacity-60"
            >
              {loading ? <Loader2 size={19} className="animate-spin" /> : <LockKeyhole size={18} />}
              {loading ? 'Signing In...' : 'Secure Admin Login'}
            </button>
          </form>

          <p className="mt-7 text-center text-xs text-gray-600">
            Authorized administrator access only.
          </p>
        </div>
      </div>
    </main>
  )
}
