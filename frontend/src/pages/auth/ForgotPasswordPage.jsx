import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiZap, FiMail, FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authAPI.forgotPassword(email)
      setSent(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(20,184,151,0.08) 0%,transparent 70%)' }} />

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/login" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#14b897,#0d9478)', boxShadow: '0 0 20px rgba(20,184,151,0.4)' }}>
              <FiZap size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl">Job<span className="gradient-text">Hub</span></span>
          </Link>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Forgot Password?</h1>
          <p className="text-sm" style={{ color: '#64748b' }}>
            No worries — we'll send you a reset link
          </p>
        </div>

        <div className="glass-card p-8">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="section-label">Your Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2" size={15} style={{ color: '#475569' }} />
                  <input
                    className="input pl-11"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading
                  ? <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: '#080c14', borderTopColor: 'transparent' }} />
                  : <><span>Send Reset Link</span><FiArrowRight size={15} /></>
                }
              </button>
            </form>
          ) : (
            // Success state
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(20,184,151,0.15)', border: '1px solid rgba(20,184,151,0.3)' }}>
                <FiMail size={28} style={{ color: '#14b897' }} />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">Check your inbox!</h3>
              <p className="text-sm mb-2" style={{ color: '#94a3b8' }}>
                We sent a password reset link to:
              </p>
              <p className="font-bold text-white mb-6">{email}</p>
              <p className="text-xs mb-6" style={{ color: '#475569' }}>
                Didn't receive it? Check your spam folder or try again.
              </p>
              <button onClick={() => setSent(false)} className="btn-secondary w-full text-sm">
                Try a different email
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid rgba(46,63,110,0.4)' }}>
            <Link to="/login" className="text-sm flex items-center justify-center gap-1.5 transition-colors" style={{ color: '#64748b' }}>
              <FiArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
