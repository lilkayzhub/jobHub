import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobsAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { FiSave, FiEye } from 'react-icons/fi'

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

export default function PostJobPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', requirements: '', responsibilities: '',
    location: '', job_type: 'full_time', experience_level: 'entry',
    salary_min: '', salary_max: '', salary_currency: 'USD',
    category: '', deadline: '', status: 'open',
  })

  useEffect(() => {
    jobsAPI.categories().then(r => setCategories(r.data.results || r.data))
  }, [])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e, statusOverride) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form }
      if (statusOverride) payload.status = statusOverride
      if (!payload.salary_min) delete payload.salary_min
      if (!payload.salary_max) delete payload.salary_max
      if (!payload.category)   delete payload.category
      if (!payload.deadline)   delete payload.deadline

      await jobsAPI.create(payload)
      toast.success(statusOverride === 'draft' ? 'Saved as draft!' : 'Job posted successfully!')
      navigate('/employer')
    } catch (err) {
      const errors = err.response?.data
      if (errors) Object.values(errors).flat().forEach(m => toast.error(m))
      else toast.error('Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  const Label = ({ children, required }) => (
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-800">Post a New Job</h1>
        <p className="text-slate-500 mt-1">Fill in the details below to attract the right candidates</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-5">
          <h2 className="font-display font-semibold text-slate-800 border-b border-slate-100 pb-3">Basic Information</h2>

          <div>
            <Label required>Job Title</Label>
            <input className="input" placeholder="e.g. Senior Software Engineer" value={form.title} onChange={set('title')} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Job Type</Label>
              <select className="input" value={form.job_type} onChange={set('job_type')}>
                {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <Label required>Experience Level</Label>
              <select className="input" value={form.experience_level} onChange={set('experience_level')}>
                {EXP_LEVELS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Location</Label>
              <input className="input" placeholder="e.g. Harare, Zimbabwe" value={form.location} onChange={set('location')} required />
            </div>
            <div>
              <Label>Category</Label>
              <select className="input" value={form.category} onChange={set('category')}>
                <option value="">Select category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Label>Application Deadline</Label>
            <input className="input" type="date" value={form.deadline} onChange={set('deadline')} min={new Date().toISOString().split('T')[0]} />
          </div>
        </div>

        {/* Salary */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-slate-800 border-b border-slate-100 pb-3">Salary (Optional)</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Currency</Label>
              <select className="input" value={form.salary_currency} onChange={set('salary_currency')}>
                {['USD', 'ZWL', 'ZAR', 'GBP', 'EUR'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label>Min Salary</Label>
              <input className="input" type="number" placeholder="e.g. 1000" value={form.salary_min} onChange={set('salary_min')} min="0" />
            </div>
            <div>
              <Label>Max Salary</Label>
              <input className="input" type="number" placeholder="e.g. 2000" value={form.salary_max} onChange={set('salary_max')} min="0" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card p-6 space-y-5">
          <h2 className="font-display font-semibold text-slate-800 border-b border-slate-100 pb-3">Job Details</h2>

          <div>
            <Label required>Job Description</Label>
            <textarea
              className="input min-h-[120px] resize-y"
              placeholder="Describe the role, what the company does, team culture..."
              value={form.description}
              onChange={set('description')}
              required
            />
          </div>

          <div>
            <Label>Responsibilities</Label>
            <textarea
              className="input min-h-[100px] resize-y"
              placeholder="List the key responsibilities of this role..."
              value={form.responsibilities}
              onChange={set('responsibilities')}
            />
          </div>

          <div>
            <Label>Requirements & Qualifications</Label>
            <textarea
              className="input min-h-[100px] resize-y"
              placeholder="List required skills, qualifications, years of experience..."
              value={form.requirements}
              onChange={set('requirements')}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pb-8">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 flex-1"
          >
            {loading
              ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              : <FiSave size={16} />
            }
            {loading ? 'Publishing...' : 'Publish Job'}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e, 'draft')}
            className="btn-secondary flex items-center justify-center gap-2 flex-1"
          >
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  )
}
