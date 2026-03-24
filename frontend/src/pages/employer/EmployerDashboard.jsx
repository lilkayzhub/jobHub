import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { jobsAPI, authAPI } from '../../services/api'
import { FiBriefcase, FiUsers, FiPlusCircle, FiTrendingUp, FiEye, FiEdit, FiBarChart2 } from 'react-icons/fi'
import ProfileStrength from '../../components/common/ProfileStrength'
import EmployerAnalytics from '../../components/analytics/EmployerAnalytics'

const statusStyle = {
  open:   { bg: 'rgba(16,185,129,0.1)',  color: '#34d399', border: 'rgba(16,185,129,0.2)' },
  draft:  { bg: 'rgba(240,165,0,0.1)',   color: '#f0a500', border: 'rgba(240,165,0,0.2)' },
  closed: { bg: 'rgba(100,116,139,0.1)', color: '#94a3b8', border: 'rgba(100,116,139,0.2)' },
}

export default function EmployerDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('jobs')

  useEffect(() => {
    Promise.all([jobsAPI.manage(), authAPI.employerProfile()])
      .then(([jobsRes, profileRes]) => {
        setJobs(jobsRes.data.results || jobsRes.data)
        setProfile(profileRes.data)
      }).finally(() => setLoading(false))
  }, [])

  const totalApps = jobs.reduce((s, j) => s + (j.applications_count || 0), 0)
  const openJobs = jobs.filter(j => j.status === 'open').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between mb-10">
        <div className="animate-slide-up">
          <p className="section-label">Dashboard</p>
          <h1 className="font-display font-bold text-3xl text-white">
            Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'},{' '}
            <span className="gradient-text">{user?.first_name || user?.username}</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>Here's what's happening with your hiring</p>
        </div>
        <Link to="/employer/post-job" className="btn-primary hidden sm:flex"><FiPlusCircle size={16} /> Post New Job</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Jobs Posted',     value: jobs.length, icon: FiBriefcase, color: '#14b897', glow: 'rgba(20,184,151,0.15)' },
          { label: 'Open Positions',  value: openJobs,    icon: FiTrendingUp, color: '#f0a500', glow: 'rgba(240,165,0,0.12)' },
          { label: 'Total Applicants',value: totalApps,   icon: FiUsers,      color: '#6366f1', glow: 'rgba(99,102,241,0.12)' },
        ].map((s, i) => (
          <div key={s.label} className="glass-card p-5 animate-slide-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: s.glow, border: `1px solid ${s.color}25` }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <div className="font-display font-bold text-3xl text-white">{loading ? '—' : s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main panel */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex gap-1 mb-4 p-1 rounded-xl w-fit" style={{ background: 'rgba(13,18,32,0.8)', border: '1px solid rgba(46,63,110,0.4)' }}>
            {[{ key: 'jobs', label: 'My Jobs', icon: FiBriefcase }, { key: 'analytics', label: 'Analytics', icon: FiBarChart2 }].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200"
                style={tab === t.key
                  ? { background: 'rgba(20,184,151,0.15)', color: '#2dd4aa', border: '1px solid rgba(20,184,151,0.2)' }
                  : { color: '#64748b' }}>
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>

          {tab === 'jobs' ? (
            <div className="glass-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(46,63,110,0.4)' }}>
                <h2 className="font-bold text-white">Your Job Postings</h2>
                <Link to="/employer/post-job" className="btn-primary text-xs px-3 py-1.5 sm:hidden flex items-center gap-1"><FiPlusCircle size={13} /> Post</Link>
              </div>
              {loading ? (
                <div className="p-5 space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-12" />)}</div>
              ) : jobs.length === 0 ? (
                <div className="p-16 text-center">
                  <FiBriefcase size={36} className="mx-auto mb-3" style={{ color: '#1a2340' }} />
                  <p className="font-bold text-white mb-1">No jobs posted yet</p>
                  <Link to="/employer/post-job" className="btn-primary inline-flex mt-4 text-sm"><FiPlusCircle size={15} /> Post Your First Job</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(46,63,110,0.4)' }}>
                        {['Job Title', 'Type', 'Status', 'Applicants', 'Actions'].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest" style={{ color: '#334155' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map(job => {
                        const s = statusStyle[job.status] || statusStyle.closed
                        return (
                          <tr key={job.id} className="transition-colors" style={{ borderBottom: '1px solid rgba(46,63,110,0.2)' }}>
                            <td className="px-5 py-3.5 font-bold text-white">{job.title}</td>
                            <td className="px-5 py-3.5 capitalize" style={{ color: '#64748b' }}>{job.job_type?.replace('_', ' ')}</td>
                            <td className="px-5 py-3.5">
                              <span className="badge" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{job.status}</span>
                            </td>
                            <td className="px-5 py-3.5 font-bold" style={{ color: '#14b897' }}>{job.applications_count || 0}</td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <Link to={`/employer/jobs/${job.id}/applications`} className="flex items-center gap-1 text-xs font-bold" style={{ color: '#14b897' }}><FiEye size={12} /> View</Link>
                                <Link to={`/employer/jobs/${job.id}/edit`} className="flex items-center gap-1 text-xs" style={{ color: '#475569' }}><FiEdit size={12} /> Edit</Link>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <EmployerAnalytics />
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <ProfileStrength user={user} profile={profile} role="employer" />
          <div className="glass-card p-5">
            <p className="section-label">Quick Actions</p>
            <div className="space-y-2">
              <Link to="/employer/post-job" className="btn-primary w-full justify-center text-sm flex items-center gap-2"><FiPlusCircle size={15} /> Post a New Job</Link>
              <Link to="/employer/profile" className="btn-secondary w-full justify-center text-sm flex items-center gap-2">Update Company Profile</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
