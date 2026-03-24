import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import { FiZap, FiArrowRight, FiBriefcase, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username:'', email:'', first_name:'', last_name:'', phone:'', role:'', password:'', password2:'' })
  const [loading, setLoading] = useState(false)
  const set = field => e => setForm(f=>({...f,[field]:e.target.value}))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password2) { toast.error("Passwords don't match"); return }
    setLoading(true)
    try {
      await authAPI.register(form)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      const errors = err.response?.data
      if (errors) Object.values(errors).flat().forEach(m => toast.error(m))
      else toast.error('Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none" style={{background:'radial-gradient(ellipse,rgba(20,184,151,0.07) 0%,transparent 70%)'}}/>

      <div className="w-full max-w-lg animate-slide-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#14b897,#0d9478)',boxShadow:'0 0 20px rgba(20,184,151,0.4)'}}>
              <FiZap size={20} className="text-white"/>
            </div>
            <span className="font-display font-bold text-2xl">Job<span className="gradient-text">Hub</span></span>
          </div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Create your account</h1>
          <p className="text-sm" style={{color:'#64748b'}}>Join thousands of professionals on JobHub</p>
        </div>

        <div className="glass-card p-8">
          {!form.role ? (
            <div>
              <p className="section-label text-center mb-6">I want to...</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { role:'seeker', icon: FiSearch, title:'Find a Job', desc:'Browse and apply to opportunities' },
                  { role:'employer', icon: FiBriefcase, title:'Hire Talent', desc:'Post jobs and find candidates' },
                ].map(opt => (
                  <button key={opt.role} onClick={()=>setForm(f=>({...f,role:opt.role}))}
                    className="group relative p-6 rounded-xl text-left transition-all duration-300"
                    style={{background:'rgba(19,26,46,0.5)',border:'1px solid rgba(46,63,110,0.5)'}}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300"
                      style={{background:'rgba(20,184,151,0.1)',border:'1px solid rgba(20,184,151,0.2)'}}>
                      <opt.icon size={20} style={{color:'#14b897'}}/>
                    </div>
                    <div className="font-bold text-white text-sm mb-1">{opt.title}</div>
                    <div className="text-xs" style={{color:'#64748b'}}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 mb-6 pb-4" style={{borderBottom:'1px solid rgba(46,63,110,0.4)'}}>
                <button type="button" onClick={()=>setForm(f=>({...f,role:''}))}
                  className="text-sm transition-colors" style={{color:'#14b897'}}>← Back</button>
                <span className="text-sm" style={{color:'#64748b'}}>
                  Registering as: <span className="font-bold text-white capitalize">{form.role === 'seeker' ? 'Job Seeker' : 'Employer'}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="section-label">First Name</label><input className="input" placeholder="John" value={form.first_name} onChange={set('first_name')} required/></div>
                <div><label className="section-label">Last Name</label><input className="input" placeholder="Doe" value={form.last_name} onChange={set('last_name')} required/></div>
              </div>
              <div><label className="section-label">Username</label><input className="input" placeholder="johndoe" value={form.username} onChange={set('username')} required/></div>
              <div><label className="section-label">Email</label><input className="input" type="email" placeholder="john@example.com" value={form.email} onChange={set('email')} required/></div>
              <div><label className="section-label">Phone Number</label><input className="input" type="tel" placeholder="e.g. 0771234567" value={form.phone} onChange={set('phone')} required/></div>
              <div><label className="section-label">Password</label><input className="input" type="password" placeholder="Min. 8 characters" value={form.password} onChange={set('password')} required minLength={8}/></div>
              <div><label className="section-label">Confirm Password</label><input className="input" type="password" placeholder="••••••••" value={form.password2} onChange={set('password2')} required/></div>

              <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                {loading
                  ? <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{borderColor:'#080c14',borderTopColor:'transparent'}}/>
                  : <><span>Create Account</span><FiArrowRight size={16}/></>
                }
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 text-center" style={{borderTop:'1px solid rgba(46,63,110,0.4)'}}>
            <p className="text-sm" style={{color:'#64748b'}}>
              Already have an account?{' '}
              <Link to="/login" className="font-bold" style={{color:'#14b897'}}>Sign in →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
