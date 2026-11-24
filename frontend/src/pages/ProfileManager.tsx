import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Save, UserRound, Loader2 } from 'lucide-react'

export default function ProfileManager() {
  const [name, setName] = useState('TAMIM TH. EDITOR')
  const [bio, setBio] = useState('Welcome to my creative world.')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadProfile() {
      if (!supabase) {
        setMessage('Supabase connection is missing.')
        setLoading(false)
        return
      }

      const { data: authData } = await supabase.auth.getUser()

      if (!authData.user) {
        setMessage('Please login again.')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('site_profile')
        .select('display_name, bio')
        .eq('owner_id', authData.user.id)
        .maybeSingle()

      if (error) {
        setMessage(error.message)
      } else if (data) {
        setName(data.display_name)
        setBio(data.bio)
      }

      setLoading(false)
    }

    loadProfile()
  }, [])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return

    setSaving(true)
    setMessage('')

    const { data: authData } = await supabase.auth.getUser()
    const user = authData.user

    if (!user) {
      setMessage('Please login again.')
      setSaving(false)
      return
    }

    const { data: existing, error: findError } = await supabase
      .from('site_profile')
      .select('id')
      .eq('owner_id', user.id)
      .maybeSingle()

    if (findError) {
      setMessage(findError.message)
      setSaving(false)
      return
    }

    const result = existing
      ? await supabase
          .from('site_profile')
          .update({
            display_name: name,
            bio,
          })
          .eq('owner_id', user.id)
      : await supabase
          .from('site_profile')
          .insert({
            owner_id: user.id,
            display_name: name,
            bio,
          })

    setMessage(result.error ? result.error.message : 'Profile saved successfully!')
    setSaving(false)
  }

  if (loading) {
    return <div className="p-8 text-[#d4af37]">Loading profile...</div>
  }

  return (
    <div className="max-w-3xl rounded-2xl border border-[#d4af37]/20 bg-[#111] p-6 sm:p-8">
      <div className="mb-7 flex items-center gap-3">
        <UserRound className="text-[#d4af37]" size={28} />
        <div>
          <h3 className="text-xl font-bold">Personal Profile</h3>
          <p className="mt-1 text-xs text-gray-500">Manage your public identity</p>
        </div>
      </div>

      <form onSubmit={saveProfile} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm text-gray-300">Display Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            maxLength={100}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-white outline-none focus:border-[#d4af37]"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">Biography</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            required
            maxLength={1000}
            rows={6}
            className="w-full resize-y rounded-xl border border-white/10 bg-black px-4 py-4 text-white outline-none focus:border-[#d4af37]"
            placeholder="Write something about yourself..."
          />
        </div>

        {message && (
          <p role="status" className="rounded-lg border border-[#d4af37]/20 bg-[#d4af37]/5 p-3 text-sm text-[#d4af37]">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[#d4af37] px-7 py-4 font-bold text-black disabled:opacity-60"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
