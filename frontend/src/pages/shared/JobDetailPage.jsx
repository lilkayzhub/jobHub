import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { jobsAPI, applicationsAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { FiMapPin, FiClock, FiBriefcase, FiDollarSign, FiCalendar, FiArrowLeft, FiUsers } from 'react-icons/fi'
import { formatDistanceToNow, format } from 'date-fns'

const typeLabels = {
  full_time: 'Full Time', part_time: 'Part Time',
  contract: 'Contract', internship: 'Internship', remote: 'Remote',
}
const expLabels = {
  entry: 'Entry Level', mid: 'Mid Level', senior: 'Senior Level', executive: 'Executive',
}

export default function JobDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    jobsAPI.detail(id)
      .then(r => setJob(r.data))
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleApply = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setApplying(true)
    try {
      await applicationsAPI.apply({ job: id, cover_letter: coverLetter })
      toast.success('Application submitted! The employer has been notified.')
      setApplied(true)
      setShowApplyForm(false)
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0]
        || err.response?.data?.detail
        || 'Failed to apply'
      toast.error(msg)
    } finally {
      setApplying(false)
    }
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-4">
      <div className="h-8 bg-slate-200 rounded w-1/2" />
      <div className="h-4 bg-slate-100 rounded w-1/3" />
      <div className="h-48 bg-slate-100 rounded mt-6" />
    </div>
  )

  if (!job) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="text-slate-500">Job not found.</p>
      <Link to="/jobs" className="btn-primary mt-4 inline-flex">Browse Jobs</Link>
    </div>
  )

  const salary = job.salary_min && job.salary_max
    ? `${job.salary_currency} ${Number(job.salary_min).toLocaleString()} – ${Number(job.salary_max).toLocaleString()} / mo`
    : null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <FiArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shrink-0">
                <FiBriefcase className="text-primary-600" size={24} />
              </div>
              <div className="flex-1">
                <h1 className="font-display text-2xl font-bold text-slate-800">{job.title}</h1>
                <p className="text-slate-500 mt-0.5">{job.employer_name}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="badge bg-primary-50 text-primary-700">{typeLabels[job.job_type]}</span>
                  <span className="badge bg-slate-100 text-slate-600">{expLabels[job.experience_level]}</span>
                  {job.category_name && <span className="badge bg-orange-50 text-orange-700">{job.category_name}</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <FiMapPin size={14} className="text-slate-400" />{job.location}
              </div>
              {salary && (
                <div className="flex items-center gap-2">
                  <FiDollarSign size={14} className="text-slate-400" />{salary}
                </div>
              )}
              <div className="flex items-center gap-2">
                <FiUsers size={14} className="text-slate-400" />{job.applications_count} applicants
              </div>
              <div className="flex items-center gap-2">
                <FiClock size={14} className="text-slate-400" />
                {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-slate-800 mb-3">Job Description</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {job.responsibilities && (
            <div className="card p-6">
              <h2 className="font-display font-semibold text-slate-800 mb-3">Responsibilities</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.responsibilities}</p>
            </div>
          )}

          {job.requirements && (
            <div className="card p-6">
              <h2 className="font-display font-semibold text-slate-800 mb-3">Requirements</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.requirements}</p>
            </div>
          )}

          {/* Apply form */}
          {showApplyForm && (
            <div className="card p-6 border-2 border-primary-200">
              <h2 className="font-display font-semibold text-slate-800 mb-4">Submit Your Application</h2>
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Cover Letter <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    className="input min-h-[140px] resize-y"
                    placeholder="Tell the employer why you're a great fit for this role..."
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={applying} className="btn-primary flex items-center gap-2">
                    {applying && <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button type="button" onClick={() => setShowApplyForm(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5 sticky top-20">
            {applied ? (
              <div className="text-center py-2">
                <div className="text-3xl mb-2">✅</div>
                <p className="font-semibold text-green-700">Applied!</p>
                <p className="text-sm text-slate-500 mt-1">We notified the employer</p>
              </div>
            ) : user?.role === 'seeker' ? (
              <button
                onClick={() => setShowApplyForm(true)}
                className="btn-primary w-full"
              >
                Apply Now
              </button>
            ) : !user ? (
              <Link to="/login" className="btn-primary w-full block text-center">
                Log In to Apply
              </Link>
            ) : null}

            {job.deadline && (
              <p className="text-xs text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
                <FiCalendar size={12} /> Deadline: {format(new Date(job.deadline), 'MMM d, yyyy')}
              </p>
            )}

            <div className="mt-5 pt-5 border-t border-slate-100 space-y-2 text-sm text-slate-500">
              <div className="flex justify-between">
                <span>Job Type</span>
                <span className="font-medium text-slate-700">{typeLabels[job.job_type]}</span>
              </div>
              <div className="flex justify-between">
                <span>Experience</span>
                <span className="font-medium text-slate-700">{expLabels[job.experience_level]}</span>
              </div>
              <div className="flex justify-between">
                <span>Location</span>
                <span className="font-medium text-slate-700">{job.location}</span>
              </div>
              {salary && (
                <div className="flex justify-between">
                  <span>Salary</span>
                  <span className="font-medium text-slate-700">{salary}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
