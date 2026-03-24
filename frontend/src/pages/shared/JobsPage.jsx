import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { jobsAPI } from '../../services/api'
import JobCard from '../../components/jobs/JobCard'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'

const JOB_TYPES = [
  {value:'',label:'All Types'},{value:'full_time',label:'Full Time'},
  {value:'part_time',label:'Part Time'},{value:'contract',label:'Contract'},
  {value:'internship',label:'Internship'},{value:'remote',label:'Remote'},
]

export default function JobsPage() {
  const [searchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [jobType, setJobType] = useState('')
  const [category, setCategory] = useState('')
  const [count, setCount] = useState(0)

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search)   params.search   = search
      if (jobType)  params.job_type = jobType
      if (category) params.category = category
      const { data } = await jobsAPI.list(params)
      const list = data.results || data
      setJobs(list)
      setCount(data.count || list.length)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { jobsAPI.categories().then(r => setCategories(r.data.results || r.data)) }, [])
  useEffect(() => { const t = setTimeout(fetchJobs, 350); return () => clearTimeout(t) }, [search, jobType, category])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero search */}
      <div className="relative rounded-2xl overflow-hidden mb-10 p-8 sm:p-12"
        style={{ background: 'linear-gradient(135deg,rgba(13,18,32,0.9) 0%,rgba(8,12,20,0.9) 100%)', border: '1px solid rgba(46,63,110,0.5)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 50%,rgba(20,184,151,0.12) 0%,transparent 60%)' }} />
        <div className="relative">
          <p className="section-label">Opportunities</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-2">
            Find Your Next <span className="gradient-text">Role</span>
          </h1>
          <p className="text-base mb-8" style={{ color: '#64748b' }}>{count} open positions waiting for you</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: '#475569' }} />
              <input className="input pl-11 py-3.5" placeholder="Job title, skills, company..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button onClick={fetchJobs} className="btn-primary px-8 py-3.5">Search</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-52 shrink-0">
          <div className="glass-card p-5 sticky top-20">
            <div className="flex items-center gap-2 mb-5">
              <FiFilter size={14} style={{ color: '#14b897' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#14b897' }}>Filters</span>
              {(jobType || category) && (
                <button onClick={() => { setJobType(''); setCategory('') }} className="ml-auto" style={{ color: '#ef4444' }}>
                  <FiX size={14} />
                </button>
              )}
            </div>
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#334155' }}>Job Type</p>
                {JOB_TYPES.map(t => (
                  <button key={t.value} onClick={() => setJobType(t.value)}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all duration-150 mb-0.5"
                    style={jobType === t.value
                      ? { background: 'rgba(20,184,151,0.1)', color: '#2dd4aa', border: '1px solid rgba(20,184,151,0.2)' }
                      : { color: '#64748b' }}>
                    {t.label}
                  </button>
                ))}
              </div>
              {categories.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#334155' }}>Category</p>
                  <button onClick={() => setCategory('')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all duration-150 mb-0.5"
                    style={!category ? { background: 'rgba(20,184,151,0.1)', color: '#2dd4aa', border: '1px solid rgba(20,184,151,0.2)' } : { color: '#64748b' }}>
                    All
                  </button>
                  {categories.map(c => (
                    <button key={c.id} onClick={() => setCategory(c.id)}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all duration-150 mb-0.5"
                      style={category === c.id ? { background: 'rgba(20,184,151,0.1)', color: '#2dd4aa', border: '1px solid rgba(20,184,151,0.2)' } : { color: '#64748b' }}>
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Listings */}
        <main className="flex-1">
          <p className="text-sm mb-4" style={{ color: '#475569' }}>
            {loading ? 'Searching...' : `${count} position${count !== 1 ? 's' : ''} found`}
          </p>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="skeleton h-32" />)}</div>
          ) : jobs.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <FiSearch size={40} className="mx-auto mb-4" style={{ color: '#1a2340' }} />
              <p className="font-bold text-white mb-1">No jobs found</p>
              <p className="text-sm" style={{ color: '#475569' }}>Try different keywords or clear filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job, i) => (
                <div key={job.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
