import { useState, useEffect } from 'react'
import { jobsAPI, applicationsAPI } from '../../services/api'
import { FiTrendingUp, FiEye, FiUsers, FiBriefcase, FiBarChart2 } from 'react-icons/fi'

export default function EmployerAnalytics() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobsAPI.manage().then(r => setJobs(r.data.results || r.data)).finally(() => setLoading(false))
  }, [])

  const totalApps = jobs.reduce((s, j) => s + (j.applications_count || 0), 0)
  const openJobs  = jobs.filter(j => j.status === 'open').length
  const closedJobs = jobs.filter(j => j.status === 'closed').length
  const topJobs = [...jobs].sort((a, b) => (b.applications_count || 0) - (a.applications_count || 0)).slice(0, 5)
  const avgApps = jobs.length > 0 ? (totalApps / jobs.length).toFixed(1) : 0

  // Bar chart — relative widths
  const maxApps = Math.max(...jobs.map(j => j.applications_count || 0), 1)

  // Job type breakdown
  const typeBreakdown = jobs.reduce((acc, j) => {
    const t = j.job_type || 'other'
    acc[t] = (acc[t] || 0) + 1
    return acc
  }, {})

  const typeLabels = { full_time: 'Full Time', part_time: 'Part Time', contract: 'Contract', internship: 'Internship', remote: 'Remote' }
  const typeColors = { full_time: '#14b897', part_time: '#6366f1', contract: '#f0a500', internship: '#ec4899', remote: '#3b82f6' }

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => <div key={i} className="skeleton h-24" />)}
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Jobs',    value: jobs.length,  color: '#14b897', icon: FiBriefcase },
          { label: 'Open Jobs',     value: openJobs,     color: '#34d399', icon: FiTrendingUp },
          { label: 'Total Applies', value: totalApps,    color: '#f0a500', icon: FiUsers },
          { label: 'Avg per Job',   value: avgApps,      color: '#6366f1', icon: FiBarChart2 },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <s.icon size={18} className="mx-auto mb-2" style={{ color: s.color }} />
            <div className="font-display font-bold text-2xl text-white">{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: '#475569' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Applications per job — bar chart */}
      {jobs.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <FiBarChart2 size={16} style={{ color: '#14b897' }} /> Applications per Job
          </h3>
          <div className="space-y-3">
            {topJobs.map(job => (
              <div key={job.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white truncate max-w-[60%]">{job.title}</span>
                  <span className="text-xs font-bold" style={{ color: '#14b897' }}>{job.applications_count || 0} apps</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(46,63,110,0.4)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${((job.applications_count || 0) / maxApps) * 100}%`,
                      background: 'linear-gradient(90deg, #14b897, #0d9478)',
                      minWidth: job.applications_count > 0 ? '4px' : '0',
                    }} />
                </div>
              </div>
            ))}
            {jobs.length === 0 && <p className="text-sm text-center py-4" style={{ color: '#475569' }}>No data yet</p>}
          </div>
        </div>
      )}

      {/* Job type breakdown */}
      {Object.keys(typeBreakdown).length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <FiEye size={16} style={{ color: '#14b897' }} /> Job Type Breakdown
          </h3>
          <div className="space-y-2">
            {Object.entries(typeBreakdown).map(([type, count]) => (
              <div key={type} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: typeColors[type] || '#64748b' }} />
                <span className="text-sm flex-1" style={{ color: '#94a3b8' }}>{typeLabels[type] || type}</span>
                <span className="text-sm font-bold text-white">{count}</span>
                <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(46,63,110,0.4)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(count / jobs.length) * 100}%`, background: typeColors[type] || '#64748b' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
