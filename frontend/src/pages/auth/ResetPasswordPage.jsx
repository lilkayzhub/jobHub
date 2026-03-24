import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FiZap, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const [searchParams]          = useSearchParams()
  const navigate                = useNavigate()
  const uid                     = searchParams.get('uid')
  const token                   = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)

  // Missing token in URL
  if (!uid || !token) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="font-display font-bold text-xl text-white mb-2">Invalid Reset Link</h2>
        <p className="text-sm mb-6" style={{ color: '#64748b' }}>This link is missing required parameters.</p>
        <Link to="/forgot-password" className="btn-primary inline-flex">Request a New Link</Link>
      </div>
    </div>
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== password2) { toast.error("Passwords don't match"); return }
    if (password.length < 8)    { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      await authAPI.resetPassword({ uid, token, password })
      setDone(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      const msg = err.response?.data?.error || 'Reset failed. The link may have expired.'
      toast.error(msg)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(20,184,151,0.08) 0%,transparent 70%)' }} />

      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#14b897,#0d9478)', boxShadow: '0 0 20px rgba(20,184,151,0.4)' }}>
              <FiZap size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl">Job<span className="gradient-text">Hub</span></span>
          </Link>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Set New Password</h1>
          <p className="text-sm" style={{ color: '#64748b' }}>Choose a strong password for your account</p>
        </div>

        <div className="glass-card p-8">
          {!done ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="section-label">New Password</label>
                <div className="relative">
                  <input
                    className="input pr-12"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required minLength={8}
                  />
                  <button type="button" onClick={() => setShowPw(s => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: '#475569' }}>
                    {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
                {/* Password strength bar */}
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(46,63,110,0.4)' }}>
                      <div className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((password.length / 12) * 100, 100)}%`,
                          background: password.length < 6 ? '#f87171' : password.length < 10 ? '#f0a500' : '#34d399'
                        }} />
                    </div>
                    <p className="text-xs mt-1" style={{ color: password.length < 6 ? '#f87171' : password.length < 10 ? '#f0a500' : '#34d399' }}>
                      {password.length < 6 ? 'Too short' : password.length < 10 ? 'Fair' : 'Strong'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="section-label">Confirm Password</label>
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={password2}
                  onChange={e => setPassword2(e.target.value)}
                  required
                />
                {password2.length > 0 && (
                  <p className="text-xs mt-1" style={{ color: password === password2 ? '#34d399' : '#f87171' }}>
                    {password === password2 ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading
                  ? <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: '#080c14', borderTopColor: 'transparent' }} />
                  : <><span>Reset Password</span><FiArrowRight size={15} /></>
                }
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(20,184,151,0.15)', border: '1px solid rgba(20,184,151,0.3)' }}>
                <FiCheckCircle size={28} style={{ color: '#14b897' }} />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">Password Reset!</h3>
              <p className="text-sm mb-1" style={{ color: '#94a3b8' }}>Your password has been updated successfully.</p>
              <p className="text-xs" style={{ color: '#475569' }}>Redirecting to login in 3 seconds...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
