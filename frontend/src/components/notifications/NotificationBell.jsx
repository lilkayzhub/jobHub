import { useState, useEffect, useRef } from 'react'
import { FiBell, FiX, FiCheck, FiCheckCircle } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { formatDistanceToNow } from 'date-fns'

// Notifications stored in localStorage per user
const STORAGE_KEY = (userId) => `jobhub_notifications_${userId}`

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!user) return
    const stored = localStorage.getItem(STORAGE_KEY(user.id))
    if (stored) setNotifications(JSON.parse(stored))
  }, [user])

  const save = (notifs) => {
    if (!user) return
    localStorage.setItem(STORAGE_KEY(user.id), JSON.stringify(notifs))
    setNotifications(notifs)
  }

  const addNotification = (type, title, message) => {
    const notif = { id: Date.now(), type, title, message, read: false, createdAt: new Date().toISOString() }
    const updated = [notif, ...notifications].slice(0, 20)
    save(updated)
  }

  const markAllRead = () => save(notifications.map(n => ({ ...n, read: true })))
  const markRead = (id) => save(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  const remove = (id) => save(notifications.filter(n => n.id !== id))
  const unreadCount = notifications.filter(n => !n.read).length

  return { notifications, addNotification, markAllRead, markRead, remove, unreadCount }
}

const typeStyles = {
  success: { color: '#34d399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  info:    { color: '#60a5fa', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.2)' },
  warning: { color: '#f0a500', bg: 'rgba(240,165,0,0.1)',   border: 'rgba(240,165,0,0.2)' },
  error:   { color: '#f87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)' },
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { notifications, markAllRead, markRead, remove, unreadCount } = useNotifications()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
        style={{ background: open ? 'rgba(20,184,151,0.1)' : 'transparent', border: open ? '1px solid rgba(20,184,151,0.2)' : '1px solid transparent', color: '#94a3b8' }}>
        <FiBell size={17} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center"
            style={{ background: '#ef4444', color: 'white', fontSize: '10px' }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 rounded-2xl overflow-hidden z-50"
          style={{ background: 'rgba(8,12,20,0.98)', border: '1px solid rgba(46,63,110,0.6)', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', backdropFilter: 'blur(24px)' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(46,63,110,0.4)' }}>
            <div className="flex items-center gap-2">
              <FiBell size={15} style={{ color: '#14b897' }} />
              <span className="font-bold text-sm text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs flex items-center gap-1 transition-colors" style={{ color: '#14b897' }}>
                <FiCheckCircle size={12} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <FiBell size={28} className="mx-auto mb-2" style={{ color: '#1a2340' }} />
                <p className="text-sm" style={{ color: '#475569' }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => {
                const s = typeStyles[n.type] || typeStyles.info
                return (
                  <div key={n.id}
                    className="flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer"
                    style={{ borderBottom: '1px solid rgba(46,63,110,0.2)', background: n.read ? 'transparent' : 'rgba(20,184,151,0.03)' }}
                    onClick={() => markRead(n.id)}>
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.read ? 'transparent' : s.color, boxShadow: n.read ? 'none' : `0 0 6px ${s.color}` }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white">{n.title}</p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#64748b' }}>{n.message}</p>
                      <p className="text-xs mt-1" style={{ color: '#334155' }}>
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); remove(n.id) }}
                      className="shrink-0 p-1 rounded transition-colors" style={{ color: '#334155' }}>
                      <FiX size={12} />
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
