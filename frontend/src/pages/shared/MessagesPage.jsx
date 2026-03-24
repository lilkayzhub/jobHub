import { useState, useEffect } from 'react'
import { messagingAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { FiSend, FiInbox, FiMail, FiTrash2, FiArchive, FiChevronRight } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

export default function MessagesPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('inbox')
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCompose, setShowCompose] = useState(false)
  const [compose, setCompose] = useState({ recipient: '', subject: '', body: '' })
  const [sending, setSending] = useState(false)

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const fn = tab === 'inbox' ? messagingAPI.inbox : messagingAPI.sent
      const { data } = await fn()
      setMessages(data.results || data)
    } catch { /* noop */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchMessages(); setSelected(null) }, [tab])

  const handleSelect = async (msg) => {
    setSelected(msg)
    if (!msg.is_read && tab === 'inbox') {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m))
    }
  }

  const handleArchive = async (id) => {
    try {
      await messagingAPI.archive(id)
      setMessages(prev => prev.filter(m => m.id !== id))
      if (selected?.id === id) setSelected(null)
      toast.success('Archived')
    } catch { toast.error('Failed to archive') }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await messagingAPI.send(compose)
      toast.success('Message sent!')
      setCompose({ recipient: '', subject: '', body: '' })
      setShowCompose(false)
      if (tab === 'sent') fetchMessages()
    } catch (err) {
      const errors = err.response?.data
      if (errors) Object.values(errors).flat().forEach(m => toast.error(m))
      else toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-800">Messages</h1>
        <button
          onClick={() => setShowCompose(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <FiSend size={15} /> Compose
        </button>
      </div>

      {/* Compose modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg p-6">
            <h2 className="font-display font-bold text-slate-800 mb-4">New Message</h2>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">To (username)</label>
                <input
                  className="input"
                  placeholder="recipient_username"
                  value={compose.recipient}
                  onChange={e => setCompose(c => ({ ...c, recipient: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
                <input
                  className="input"
                  placeholder="What's this about?"
                  value={compose.subject}
                  onChange={e => setCompose(c => ({ ...c, subject: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                <textarea
                  className="input min-h-[120px] resize-y"
                  placeholder="Write your message..."
                  value={compose.body}
                  onChange={e => setCompose(c => ({ ...c, body: e.target.value }))}
                  required
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={sending} className="btn-primary flex items-center gap-2">
                  {sending && <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
                  {sending ? 'Sending...' : 'Send'}
                </button>
                <button type="button" onClick={() => setShowCompose(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden border border-slate-200 mb-3">
            {[
              { key: 'inbox', label: 'Inbox', icon: FiInbox },
              { key: 'sent',  label: 'Sent',  icon: FiSend },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
                  tab === t.key ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <t.icon size={15} /> {t.label}
              </button>
            ))}
          </div>

          {/* Message list */}
          <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)
            ) : messages.length === 0 ? (
              <div className="card p-8 text-center">
                <FiMail size={32} className="mx-auto text-slate-200 mb-2" />
                <p className="text-sm text-slate-400">No messages</p>
              </div>
            ) : messages.map(msg => (
              <button
                key={msg.id}
                onClick={() => handleSelect(msg)}
                className={`w-full text-left card p-3.5 transition-all ${selected?.id === msg.id ? 'border-primary-400 ring-1 ring-primary-200' : ''}`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className={`text-sm truncate ${!msg.is_read && tab === 'inbox' ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                    {tab === 'inbox' ? msg.sender_name : msg.recipient_name}
                  </p>
                  {!msg.is_read && tab === 'inbox' && (
                    <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">{msg.subject || '(no subject)'}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatDistanceToNow(new Date(msg.sent_at), { addSuffix: true })}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Message detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="card p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-slate-800 text-lg">
                    {selected.subject || '(no subject)'}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {tab === 'inbox' ? `From: ${selected.sender_name}` : `To: ${selected.recipient_name}`}
                    {' · '}
                    {formatDistanceToNow(new Date(selected.sent_at), { addSuffix: true })}
                  </p>
                </div>
                {tab === 'inbox' && (
                  <button
                    onClick={() => handleArchive(selected.id)}
                    className="text-slate-400 hover:text-orange-500 transition-colors p-1.5"
                    title="Archive"
                  >
                    <FiArchive size={18} />
                  </button>
                )}
              </div>

              <div className="bg-slate-50 rounded-xl p-5">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{selected.body}</p>
              </div>

              {tab === 'inbox' && (
                <div>
                  <button
                    onClick={() => {
                      setCompose({ recipient: selected.sender_name, subject: `Re: ${selected.subject}`, body: '' })
                      setShowCompose(true)
                    }}
                    className="btn-outline text-sm flex items-center gap-2"
                  >
                    <FiSend size={14} /> Reply
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="card h-full min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <FiMail size={40} className="mx-auto text-slate-200 mb-3" />
                <p className="text-sm text-slate-400">Select a message to read it</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
