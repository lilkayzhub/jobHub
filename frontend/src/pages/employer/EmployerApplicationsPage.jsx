import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { applicationsAPI, jobsAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiMail, FiUser, FiClock } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

const STATUSES = ['new', 'reviewed', 'contacted', 'rejected', 'hired']
const statusColors = {
  new:       'bg-yellow-100 text-yellow-700',
  reviewed:  'bg-blue-100 text-blue-700',
  contacted: 'bg-green-100 text-green-700',
  rejected:  'bg-red-100 text-red-600',
  hired:     'bg-emerald-100 text-emerald-700',
}

export default function EmployerApplicationsPage() {
  const { id: jobId } = useParams()
  const [job, setJob] = useState(null)
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    Promise.all([
      jobsAPI.detail(jobId),
      applicationsAPI.forJob(jobId),
    ]).then(([jobRes, appsRes]) => {
      setJob(jobRes.data)
      setApps(appsRes.data.results || appsRes.data)
    }).finally(() => setLoading(false))
  }, [jobId])

  const updateStatus = async (appId, status) => {
    setUpdating(true)
    try {
      await applicationsAPI.updateStatus(appId, status)
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status } : a))
      if (selected?.id === appId) setSelected(s => ({ ...s, status }))
      toast.success(`Status updated to "${status}"`)
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-1/3 mb-8" />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl" />)}
        </div>
        <div className="col-span-2 h-64 bg-slate-100 rounded-xl" />
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/employer" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6">
        <FiArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-800">
          Applications for: <span className="text-primary-600">{job?.title}</span>
        </h1>
        <p className="text-slate-500 mt-1">{apps.length} application{apps.length !== 1 ? 's' : ''} received</p>
      </div>

      {apps.length === 0 ? (
        <div className="card p-16 text-center">
          <FiUser size={40} className="mx-auto text-slate-200 mb-3" />
          <p className="text-slate-500 font-medium">No applications yet</p>
          <p className="text-sm text-slate-400 mt-1">Share the job link to attract candidates</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* List */}
          <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {apps.map(app => (
              <button
                key={app.id}
                onClick={() => setSelected(app)}
                className={`w-full text-left card p-4 transition-all ${selected?.id === app.id ? 'border-primary-400 ring-1 ring-primary-300' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-800 text-sm truncate">{app.applicant_name}</p>
                  <span className={`badge shrink-0 text-xs ${statusColors[app.status] || 'bg-slate-100 text-slate-600'}`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <FiClock size={11} />
                  {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}
                </p>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="card p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-bold text-slate-800">{selected.applicant_name}</h2>
                    <a href={`mailto:${selected.applicant_email}`} className="text-sm text-primary-600 hover:underline flex items-center gap-1 mt-1">
                      <FiMail size={14} /> {selected.applicant_email}
                    </a>
                    <p className="text-xs text-slate-400 mt-1">
                      Applied {formatDistanceToNow(new Date(selected.applied_at), { addSuffix: true })}
                    </p>
                  </div>
                  <span className={`badge ${statusColors[selected.status]}`}>{selected.status}</span>
                </div>

                {/* Cover letter */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Cover Letter</p>
                  <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                    {selected.cover_letter || <span className="italic text-slate-400">No cover letter provided</span>}
                  </p>
                </div>

                {/* Status update */}
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected.id, s)}
                        disabled={updating || selected.status === s}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                          selected.status === s
                            ? `${statusColors[s]} border-transparent`
                            : 'border-slate-200 text-slate-600 hover:border-primary-400 hover:text-primary-600'
                        }`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="pt-4 border-t border-slate-100">
                  <a
                    href={`mailto:${selected.applicant_email}?subject=Re: Your application for ${job?.title}`}
                    className="btn-outline text-sm flex items-center gap-2 w-fit"
                  >
                    <FiMail size={15} /> Email Applicant
                  </a>
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center h-full flex items-center justify-center">
                <div>
                  <FiUser size={36} className="mx-auto text-slate-200 mb-3" />
                  <p className="text-slate-400 text-sm">Select an applicant to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
