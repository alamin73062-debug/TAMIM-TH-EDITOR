import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { MessageSquare, Send, RefreshCw, UserRound } from 'lucide-react'

type Message = {
  id: string
  sender_id: string
  recipient_id: string
  body: string
  created_at: string
}

export default function AdminMessages() {
  const [adminId, setAdminId] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const loadInbox = useCallback(async () => {
    if (!supabase) {
      setError('Supabase connection is not configured.')
      setLoading(false)
      return
    }

    const { data: authData } = await supabase.auth.getUser()

    if (!authData.user) {
      setError('Admin session not found.')
      setLoading(false)
      return
    }

    setAdminId(authData.user.id)

    const { data, error: fetchError } = await supabase
      .from('messages')
      .select('id, sender_id, recipient_id, body, created_at')
      .order('created_at', { ascending: true })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setError('')
      setMessages(data || [])
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    loadInbox()
  }, [loadInbox])

  const conversations = Array.from(
    new Set(
      messages.map(message =>
        message.sender_id === adminId
          ? message.recipient_id
          : message.sender_id
      )
    )
  )

  const selectedMessages = messages.filter(message =>
    (message.sender_id === adminId && message.recipient_id === selectedId) ||
    (message.sender_id === selectedId && message.recipient_id === adminId)
  )

  async function sendReply(e: React.FormEvent) {
    e.preventDefault()

    if (!supabase || !reply.trim() || !selectedId || sending) return

    setSending(true)
    setError('')

    const { error: sendError } = await supabase
      .from('messages')
      .insert({
        sender_id: adminId,
        recipient_id: selectedId,
        body: reply.trim(),
      })

    if (sendError) {
      setError(sendError.message)
    } else {
      setReply('')
      await loadInbox()
    }

    setSending(false)
  }

  return (
    <section className="space-y-5">
      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="grid min-h-[550px] overflow-hidden rounded-2xl border border-[#d4af37]/20 bg-[#111] md:grid-cols-[260px_1fr]">
        <aside className="border-b border-white/10 md:border-r md:border-b-0">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div>
              <h3 className="font-bold">Inbox</h3>
              <p className="mt-1 text-xs text-gray-500">
                {conversations.length} conversations
              </p>
            </div>

            <button
              onClick={() => loadInbox()}
              className="rounded-lg border border-white/10 p-2 text-gray-400 hover:text-[#d4af37]"
              aria-label="Refresh inbox"
            >
              <RefreshCw size={17} />
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto md:max-h-[490px]">
            {loading ? (
              <p className="p-6 text-sm text-gray-500">Loading inbox...</p>
            ) : conversations.length === 0 ? (
              <div className="p-7 text-center">
                <MessageSquare className="mx-auto mb-3 text-[#d4af37]" size={28} />
                <p className="text-sm text-gray-400">No messages yet</p>
              </div>
            ) : (
              conversations.map(id => {
                const lastMessage = messages
                  .filter(m => m.sender_id === id || m.recipient_id === id)
                  .at(-1)

                return (
                  <button
                    key={id}
                    onClick={() => setSelectedId(id)}
                    className={`w-full border-b border-white/5 p-4 text-left transition ${
                      selectedId === id
                        ? 'bg-[#d4af37]/10'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#d4af37]/10 text-[#d4af37]">
                        <UserRound size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">
                          Member {id.slice(0, 8)}
                        </p>
                        <p className="mt-1 truncate text-xs text-gray-500">
                          {lastMessage?.body || ''}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </aside>

        <div className="flex min-h-[450px] min-w-0 flex-col">
          {!selectedId ? (
            <div className="grid flex-1 place-items-center p-8 text-center">
              <div>
                <MessageSquare className="mx-auto mb-4 text-[#d4af37]" size={42} />
                <h3 className="text-lg font-bold">Private Messages</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Select a conversation to view and reply.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-white/10 p-5">
                <h3 className="font-bold">Member Conversation</h3>
                <p className="mt-1 break-all text-xs text-gray-500">
                  Member ID: {selectedId}
                </p>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {selectedMessages.map(message => {
                  const own = message.sender_id === adminId

                  return (
                    <div
                      key={message.id}
                      className={`flex ${own ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          own
                            ? 'rounded-br-sm bg-[#d4af37] text-black'
                            : 'rounded-bl-sm bg-[#222] text-white'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm">
                          {message.body}
                        </p>
                        <p className={`mt-2 text-[10px] ${
                          own ? 'text-black/60' : 'text-gray-500'
                        }`}>
                          {own ? 'Admin' : 'Member'} ·{' '}
                          {new Date(message.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <form onSubmit={sendReply} className="border-t border-white/10 p-4">
                <div className="flex items-end gap-3">
                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    maxLength={5000}
                    rows={2}
                    placeholder="Write your reply..."
                    className="min-h-[55px] flex-1 resize-y rounded-xl border border-white/10 bg-black p-3 text-sm text-white outline-none focus:border-[#d4af37]"
                  />

                  <button
                    type="submit"
                    disabled={sending || !reply.trim()}
                    className="rounded-xl bg-[#d4af37] p-4 text-black disabled:opacity-40"
                    aria-label="Send reply"
                  >
                    <Send size={19} />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
