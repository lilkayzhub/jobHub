import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { applicationsAPI, authAPI } from '../../services/api'
import { FiSearch, FiBriefcase, FiClock } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'
import ProfileStrength from '../../components/common/ProfileStrength'
import ResumeAnalyzer from '../../components/common/ResumeAnalyzer'

const statusConfig = {
  new:       { label: 'Pending',   style: { background: 'rgba(240,165,0,0.1)',  color: '#f0a500', border: '1px solid rgba(240,165,0,0.2)' } },
  reviewed:  { label: 'Reviewed',  style: { background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' } },
  contacted: { label: 'Contacted', style: { background: 'rgba(20,184,151,0.1)', color: '#2dd4aa', border: '1px solid rgba(20,184,151,0.2)' } },
  rejected:  { label: 'Rejected',  style: { background: 'rgba(239,68,68,0.1)',  color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' } },
  hired:     { label: 'Hired 🎉',  style: { background: 'rgba(16,185,129,0.15)',color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' } },
}

export default function SeekerDashboard() {
  const { user } = useAuth()
  const [apps, setApps] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      applicationsAPI.myApps(),
      authAPI.seekerProfile(),
    ]).then(([appsRes, profileRes]) => {
      setApps(appsRes.data.results || appsRes.data)
      setProfile(profileRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const counts = {
    total: apps.length,
    pending: apps.filter(a => a.status === 'new').length,
    contacted: apps.filter(a => a.status === 'contacted').length,
    hired: apps.filter(a => a.status === 'hired').length,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="animate-slide-up mb-10">
        <p className="section-label">My Dashboard</p>
        <h1 className="font-display font-bold text-3xl text-white">
          Hello, <span className="gradient-text">{user?.first_name || user?.username}</span> 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>Track your applications and find new opportunities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Applied',   value: counts.total,     color: '#14b897' },
              { label: 'Pending',   value: counts.pending,   color: '#f0a500' },
              { label: 'Contacted', value: counts.contacted, color: '#6366f1' },
              { label: 'Hired',     value: counts.hired,     color: '#34d399' },
            ].map((s, i) => (
              <div key={s.label} className="glass-card p-4 text-center animate-slide-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                <div className="font-display font-bold text-3xl mb-1" style={{ color: s.color }}>{loading ? '—' : s.value}</div>
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#334155' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Link to="/jobs" className="btn-primary flex items-center gap-2 text-sm"><FiSearch size={15} /> Browse Jobs</Link>
            <Link to="/seeker/profile" className="btn-secondary text-sm">Update Profile</Link>
            <ResumeAnalyzer />
          </div>

          {/* Applications */}
          <div className="glass-card overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(46,63,110,0.4)' }}>
              <h2 className="font-bold text-white">My Applications</h2>
              <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'rgba(20,184,151,0.1)', color: '#2dd4aa' }}>{counts.total} total</span>
            </div>
            {loading ? (
              <div className="p-5 space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-16" />)}</div>
            ) : apps.length === 0 ? (
              <div className="p-16 text-center">
                <FiBriefcase size={36} className="mx-auto mb-3" style={{ color: '#1a2340' }} />
                <p className="font-bold text-white mb-1">No applications yet</p>
                <Link to="/jobs" className="btn-primary inline-flex gap-2 mt-4 text-sm"><FiSearch size={15} /> Browse Jobs</Link>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'rgba(46,63,110,0.3)' }}>
                {apps.map(app => {
                  const sc = statusConfig[app.status] || statusConfig.new
                  return (
                    <div key={app.id} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{app.job_title}</p>
                        <p className="text-xs flex items-center gap-1 mt-1" style={{ color: '#475569' }}>
                          <FiClock size={11} />{formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}
                        </p>
                      </div>
                      <span className="badge shrink-0" style={sc.style}>{sc.label}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column — Profile Strength */}
        <div className="space-y-5">
          <ProfileStrength user={user} profile={profile} role="seeker" />

          {/* Quick tips */}
          <div className="glass-card p-5">
            <p className="section-label">Career Tips</p>
            <div className="space-y-3 text-sm" style={{ color: '#64748b' }}>
              <p>💡 <strong className="text-white">Tailor your CV</strong> for each job you apply to</p>
              <p>📝 <strong className="text-white">Write a cover letter</strong> — it sets you apart</p>
              <p>🔗 <strong className="text-white">Add LinkedIn</strong> to your profile for credibility</p>
              <p>⚡ <strong className="text-white">Apply early</strong> — first applicants get more attention</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
