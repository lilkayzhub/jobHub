import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { jobsAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { FiSave, FiArrowLeft, FiTrash2 } from 'react-icons/fi'

const JOB_TYPES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
]
const EXP_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'executive', label: 'Executive' },
]

export default function EditJobPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState(null)

  useEffect(() => {
    Promise.all([jobsAPI.detail(id), jobsAPI.categories()])
      .then(([jobRes, catRes]) => {
        const j = jobRes.data
        setForm({
          title: j.title || '',
          description: j.description || '',
          requirements: j.requirements || '',
          responsibilities: j.responsibilities || '',
          location: j.location || '',
          job_type: j.job_type || 'full_time',
          experience_level: j.experience_level || 'entry',
          salary_min: j.salary_min || '',
          salary_max: j.salary_max || '',
          salary_currency: j.salary_currency || 'USD',
          category: j.category || '',
          deadline: j.deadline || '',
          status: j.status || 'open',
        })
        setCategories(catRes.data)
      })
      .catch(() => toast.error('Failed to load job'))
      .finally(() => setLoading(false))
  }, [id])

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form }
      if (!payload.salary_min) delete payload.salary_min
      if (!payload.salary_max) delete payload.salary_max
      if (!payload.category)   delete payload.category
      if (!payload.deadline)   delete payload.deadline
      await jobsAPI.update(id, payload)
      toast.success('Job updated successfully!')
      navigate('/employer')
    } catch (err) {
      const errors = err.response?.data
      if (errors) Object.values(errors).flat().forEach(m => toast.error(m))
      else toast.error('Failed to update job')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job? This cannot be undone.')) return
    setDeleting(true)
    try {
      await jobsAPI.delete(id)
      toast.success('Job deleted')
      navigate('/employer')
    } catch {
      toast.error('Failed to delete job')
    } finally { setDeleting(false) }
  }

  const handleClose = async () => {
    try {
      await jobsAPI.update(id, { status: 'closed' })
      toast.success('Job closed — no longer accepting applications')
      navigate('/employer')
    } catch { toast.error('Failed to close job') }
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
      {[1,2,3].map(i => <div key={i} className="skeleton h-20" />)}
    </div>
  )

  if (!form) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p style={{ color: '#64748b' }}>Job not found.</p>
      <Link to="/employer" className="btn-primary inline-flex mt-4">Back to Dashboard</Link>
    </div>
  )

  const Label = ({ children, required }) => (
    <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#475569' }}>
      {children}{required && <span className="ml-0.5" style={{ color: '#ef4444' }}>*</span>}
    </label>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/employer" className="flex items-center gap-1.5 text-sm mb-3 transition-colors" style={{ color: '#14b897' }}>
            <FiArrowLeft size={15} /> Back to Dashboard
          </Link>
          <h1 className="font-display font-bold text-2xl text-white">Edit Job</h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>Update your job posting details</p>
        </div>
        <div className="flex items-center gap-2">
          {form.status === 'open' && (
            <button onClick={handleClose} className="btn-secondary text-xs px-3 py-2">
              Close Job
            </button>
          )}
          <button onClick={handleDelete} disabled={deleting}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition-all duration-200"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
            <FiTrash2 size={13} /> {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Status banner */}
        <div className="glass-card p-4 flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: '#94a3b8' }}>Current Status</span>
          <div className="flex items-center gap-3">
            {['open','draft','closed'].map(s => (
              <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all duration-150 capitalize"
                style={form.status === s
                  ? { background: s==='open'?'rgba(16,185,129,0.15)':s==='draft'?'rgba(240,165,0,0.15)':'rgba(100,116,139,0.15)', color: s==='open'?'#34d399':s==='draft'?'#f0a500':'#94a3b8', border: `1px solid ${s==='open'?'rgba(16,185,129,0.3)':s==='draft'?'rgba(240,165,0,0.3)':'rgba(100,116,139,0.3)'}` }
                  : { color: '#475569', border: '1px solid rgba(46,63,110,0.3)' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-bold text-white pb-3" style={{ borderBottom: '1px solid rgba(46,63,110,0.4)' }}>Basic Information</h2>
          <div><Label required>Job Title</Label><input className="input" placeholder="e.g. Senior Software Engineer" value={form.title} onChange={set('title')} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label required>Job Type</Label>
              <select className="input" value={form.job_type} onChange={set('job_type')}>
                {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div><Label required>Experience Level</Label>
              <select className="input" value={form.experience_level} onChange={set('experience_level')}>
                {EXP_LEVELS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label required>Location</Label><input className="input" placeholder="e.g. Harare, Zimbabwe" value={form.location} onChange={set('location')} required /></div>
            <div><Label>Category</Label>
              <select className="input" value={form.category} onChange={set('category')}>
                <option value="">Select category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div><Label>Deadline</Label><input className="input" type="date" value={form.deadline} onChange={set('deadline')} /></div>
        </div>

        {/* Salary */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-bold text-white pb-3" style={{ borderBottom: '1px solid rgba(46,63,110,0.4)' }}>Salary (Optional)</h2>
          <div className="grid grid-cols-3 gap-4">
            <div><Label>Currency</Label>
              <select className="input" value={form.salary_currency} onChange={set('salary_currency')}>
                {['USD','ZWL','ZAR','GBP','EUR'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><Label>Min</Label><input className="input" type="number" placeholder="1000" value={form.salary_min} onChange={set('salary_min')} /></div>
            <div><Label>Max</Label><input className="input" type="number" placeholder="2000" value={form.salary_max} onChange={set('salary_max')} /></div>
          </div>
        </div>

        {/* Details */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-bold text-white pb-3" style={{ borderBottom: '1px solid rgba(46,63,110,0.4)' }}>Job Details</h2>
          <div><Label required>Description</Label><textarea className="input min-h-[120px] resize-y" value={form.description} onChange={set('description')} required /></div>
          <div><Label>Responsibilities</Label><textarea className="input min-h-[100px] resize-y" value={form.responsibilities} onChange={set('responsibilities')} /></div>
          <div><Label>Requirements</Label><textarea className="input min-h-[100px] resize-y" value={form.requirements} onChange={set('requirements')} /></div>
        </div>

        <div className="flex gap-3 pb-8">
          <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {saving ? <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: '#080c14', borderTopColor: 'transparent' }} /> : <FiSave size={16} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to="/employer" className="btn-secondary flex items-center justify-center px-6">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
