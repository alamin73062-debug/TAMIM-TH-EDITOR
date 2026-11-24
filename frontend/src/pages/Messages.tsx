import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Send, RefreshCw, MessageSquare, LogOut } from 'lucide-react'

type Message = {
  id: string
  sender_id: string
  recipient_id: string
  body: string
  created_at: string
}

export default function Messages() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function loadMessages(id?: string) {
    if (!supabase) {
      setError('Supabase configuration পাওয়া যায়নি।')
      setLoading(false)
      return
    }

    const currentId = id || userId
    if (!currentId) return

    const { data, error } = await supabase
      .from('messages')
      .select('id, sender_id, recipient_id, body, created_at')
      .or(`sender_id.eq.${currentId},recipient_id.eq.${currentId}`)
      .order('created_at', { ascending: true })

    if (error) setError(error.message)
    else {
      setError('')
      setMessages(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    async function initialize() {
      if (!supabase) {
        setError('Supabase configuration পাওয়া যায়নি।')
        setLoading(false)
        return
      }

      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        navigate('/login')
        return
      }

      setUserId(data.user.id)
      await loadMessages(data.user.id)
    }

    initialize()
  }, [navigate])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()

    if (!supabase || !body.trim() || sending) return

    setSending(true)
    setError('')

    const { error } = await supabase.rpc('send_site_message', {
      p_body: body.trim(),
    })

    if (error) {
      setError(error.message)
    } else {
      setBody('')
      await loadMessages()
    }

    setSending(false)
  }

  async function logout() {
    if (!supabase) return
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between">
          <Link to="/account" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#d6ad60]">
            <ArrowLeft size={18} /> Account
          </Link>

          <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400">
            <LogOut size={17} /> Logout
          </button>
        </header>

        <section className="overflow-hidden rounded-2xl border border-[#b18b45]/30 bg-[#111]">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#c49a50]/15 p-3 text-[#d6ad60]">
                <MessageSquare size={23} />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Private Messages</h1>
                <p className="text-xs text-gray-500">Contact website owner privately</p>
              </div>
            </div>

            <button onClick={() => loadMessages()} className="rounded-lg border border-white/10 p-2 text-gray-400 hover:text-white" aria-label="Refresh messages">
              <RefreshCw size={18} />
            </button>
          </div>

          <div className="min-h-[380px] space-y-4 p-5">
            {loading ? (
              <p className="py-16 text-center text-gray-500">Loading messages...</p>
            ) : messages.length === 0 ? (
              <div className="py-20 text-center">
                <MessageSquare className="mx-auto mb-3 text-[#c49a50]" size={35} />
                <p className="text-gray-300">No messages yet</p>
                <p className="mt-1 text-sm text-gray-500">Send your first private message below.</p>
              </div>
            ) : (
              messages.map((message) => {
                const own = message.sender_id === userId

                return (
                  <div key={message.id} className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${own ? 'rounded-br-sm bg-[#b18b45] text-black' : 'rounded-bl-sm bg-[#222] text-white'}`}>
                      <p className="whitespace-pre-wrap break-words text-sm">{message.body}</p>
                      <p className={`mt-2 text-[10px] ${own ? 'text-black/60' : 'text-gray-500'}`}>
                        {own ? 'You' : 'Website Owner'} · {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t border-white/10 p-4">
            {error && (
              <p className="mb-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>
            )}

            <div className="flex items-end gap-3">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={5000}
                rows={2}
                placeholder="Write your private message..."
                className="min-h-[55px] flex-1 resize-y rounded-xl border border-white/10 bg-[#080808] p-3 text-sm text-white outline-none focus:border-[#c49a50]"
              />

              <button
                type="submit"
                disabled={sending || !body.trim()}
                className="rounded-xl bg-[#c49a50] p-4 text-black transition hover:bg-[#e0bb76] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send size={19} />
              </button>
            </div>

            <p className="mt-2 text-right text-xs text-gray-600">{body.length}/5000</p>
          </form>
        </section>
      </div>
    </main>
  )
}
