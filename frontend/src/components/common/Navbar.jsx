import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useState, useEffect } from 'react'
import { FiLogOut, FiMenu, FiX, FiZap } from 'react-icons/fi'
import NotificationBell from '../notifications/NotificationBell'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const employerLinks = [
    { label: 'Dashboard',  to: '/employer' },
    { label: 'Post Job',   to: '/employer/post-job' },
    { label: 'My Profile', to: '/employer/profile' },
    { label: 'Messages',   to: '/messages' },
  ]
  const seekerLinks = [
    { label: 'Browse Jobs',  to: '/jobs' },
    { label: 'Applications', to: '/seeker' },
    { label: 'Messages',     to: '/messages' },
    { label: 'Saved Jobs',   to: '/seeker/saved-jobs' },
    { label: 'Profile',      to: '/seeker/profile' },
  ]
  const links = user?.role === 'employer' ? employerLinks : seekerLinks
  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300"
      style={{ background: scrolled ? 'rgba(8,12,20,0.96)' : 'rgba(8,12,20,0.7)', backdropFilter: 'blur(24px)', borderBottom: '1px solid ' + (scrolled ? 'rgba(46,63,110,0.4)' : 'transparent'), boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#14b897,#0d9478)' }}>
              <FiZap size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Job<span className="gradient-text">Hub</span></span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-1">
              {links.map(l => (
                <Link key={l.to} to={l.to} className={isActive(l.to) ? 'nav-link-active' : 'nav-link'}>{l.label}</Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <NotificationBell />
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }} />
                  <span className="text-sm" style={{ color: '#94a3b8' }}>
                    {user.first_name || user.username}
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(20,184,151,0.1)', color: '#2dd4aa', border: '1px solid rgba(20,184,151,0.2)' }}>{user.role}</span>
                  </span>
                </div>
                <button onClick={handleLogout} className="btn-ghost text-xs flex items-center gap-1.5" style={{ color: '#64748b' }}>
                  <FiLogOut size={14} /><span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
              </div>
            )}
            {user && (
              <button className="md:hidden btn-ghost p-2" onClick={() => setMenuOpen(o => !o)}>
                {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {menuOpen && user && (
        <div className="md:hidden border-t px-4 pb-4 pt-2 space-y-1" style={{ borderColor: 'rgba(46,63,110,0.4)', background: 'rgba(8,12,20,0.98)' }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className={'block ' + (isActive(l.to) ? 'nav-link-active' : 'nav-link')}>{l.label}</Link>
          ))}
          <button onClick={handleLogout} className="block w-full text-left nav-link" style={{ color: '#f87171' }}>Logout</button>
        </div>
      )}
    </nav>
  )
}
