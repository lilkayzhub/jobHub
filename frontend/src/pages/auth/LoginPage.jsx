import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { FiEye, FiEyeOff, FiZap, FiArrowRight } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(form)
      toast.success('Welcome back!')
      const role = data.role || JSON.parse(atob(data.access.split('.')[1])).role
      navigate(from || (role === 'employer' ? '/employer' : '/seeker'), { replace: true })
    } catch {
      toast.error('Invalid username or password')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(20,184,151,0.08) 0%,transparent 70%)' }} />

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#14b897,#0d9478)', boxShadow: '0 0 20px rgba(20,184,151,0.4)' }}>
              <FiZap size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl">Job<span className="gradient-text">Hub</span></span>
          </div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Welcome back</h1>
          <p className="text-sm" style={{ color: '#64748b' }}>Sign in to continue your journey</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="section-label">Username</label>
              <input className="input" type="text" placeholder="your_username"
                value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="section-label" style={{ marginBottom: 0 }}>Password</label>
                <Link to="/forgot-password" className="text-xs transition-colors hover:underline"
                  style={{ color: '#14b897' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input className="input pr-12" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#475569' }}>
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {loading
                ? <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: '#080c14', borderTopColor: 'transparent' }} />
                : <><span>Sign In</span><FiArrowRight size={16} /></>
              }
            </button>
          </form>

          <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid rgba(46,63,110,0.4)' }}>
            <p className="text-sm" style={{ color: '#64748b' }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-bold transition-colors" style={{ color: '#14b897' }}>
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
