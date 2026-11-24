import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { User, Mail, Save, LogOut, Loader2, ArrowLeft, MessageSquare } from 'lucide-react'

export default function Account() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadAccount() {
      if (!supabase) {
        setError('Supabase connection is not configured.')
        setLoading(false)
        return
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        navigate('/login', { replace: true })
        return
      }

      setEmail(user.email || '')

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) {
        setError(profileError.message)
      } else {
        setDisplayName(data?.display_name || '')
      }

      setLoading(false)
    }

    loadAccount()
  }, [navigate])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!supabase) return

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      navigate('/login')
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        display_name: displayName.trim(),
      })

    setSaving(false)

    if (error) {
      setError(error.message)
    } else {
      setMessage('Profile updated successfully!')
    }
  }

  async function logout() {
    await supabase?.auth.signOut()
    navigate('/login', { replace: true })
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#080808] text-[#d4af37]">
        <Loader2 className="animate-spin" size={32} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#080808] px-5 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#d4af37]">
          <ArrowLeft size={17} /> Back to Website
        </Link>

        <div className="rounded-3xl border border-[#d4af37]/25 bg-[#111] p-7 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-[#d4af37]/40 bg-[#d4af37]/10">
              <User size={30} className="text-[#d4af37]" />
            </div>

            <h1 className="text-3xl font-black">
              MEMBER <span className="text-[#d4af37]">ACCOUNT</span>
            </h1>

            <p className="mt-3 text-sm text-gray-500">TAMIM TH. EDITOR</p>
          </div>

          <div className="mb-6 rounded-xl border border-white/10 bg-black p-4">
            <p className="mb-2 text-xs text-gray-500">REGISTERED EMAIL</p>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-[#d4af37]" />
              <span className="break-all text-sm">{email}</span>
            </div>
          </div>

          <form onSubmit={saveProfile} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-300">Display Name</label>
              <input
                type="text"
                required
                maxLength={60}
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-white outline-none focus:border-[#d4af37]"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            {message && (
              <p role="status" className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] py-4 font-bold text-black disabled:opacity-60"
            >
              {saving ? <Loader2 size={19} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          <Link
            to="/messages"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#d4af37]/40 py-4 font-semibold text-[#d4af37] hover:bg-[#d4af37]/10"
          >
            <MessageSquare size={18} /> Private Messages
          </Link>

          <button
            onClick={logout}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 py-4 font-semibold text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </main>
  )
}
