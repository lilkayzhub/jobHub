import { useState } from 'react'
import { FiShare2, FiLink, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ShareJob({ job }) {
  const [open, setOpen] = useState(false)
  const url = `${window.location.origin}/jobs/${job.id}`

  const shareWhatsApp = () => {
    const text = `🚀 Job Opportunity: *${job.title}* at ${job.employer_name}\n📍 ${job.location}\n\nApply here: ${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    setOpen(false)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
    setOpen(false)
  }

  const shareEmail = () => {
    const subject = `Job Opportunity: ${job.title} at ${job.employer_name}`
    const body = `Hi,\n\nI found this job that might interest you:\n\n${job.title} at ${job.employer_name}\nLocation: ${job.location}\n\nApply here: ${url}`
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl transition-all duration-200"
        style={{ background: 'rgba(46,63,110,0.3)', border: '1px solid rgba(46,63,110,0.5)', color: '#94a3b8' }}>
        <FiShare2 size={15} /> Share
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 w-52 rounded-xl overflow-hidden z-50"
            style={{ background: 'rgba(8,12,20,0.98)', border: '1px solid rgba(46,63,110,0.6)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(46,63,110,0.4)' }}>
              <span className="text-xs font-bold text-white">Share Job</span>
              <button onClick={() => setOpen(false)} style={{ color: '#475569' }}><FiX size={14} /></button>
            </div>
            {[
              { label: 'Share on WhatsApp', icon: '💬', action: shareWhatsApp, color: '#25D366' },
              { label: 'Share via Email',   icon: '📧', action: shareEmail,    color: '#60a5fa' },
              { label: 'Copy Link',         icon: '🔗', action: copyLink,      color: '#14b897' },
            ].map(opt => (
              <button key={opt.label} onClick={opt.action}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors"
                style={{ color: '#94a3b8', borderBottom: '1px solid rgba(46,63,110,0.2)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
