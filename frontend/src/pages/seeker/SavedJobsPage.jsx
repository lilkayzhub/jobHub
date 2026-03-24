import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobsAPI } from '../../services/api'
import { useSavedJobs } from '../../components/common/SaveJobButton'
import JobCard from '../../components/jobs/JobCard'
import { FiBookmark, FiSearch } from 'react-icons/fi'

export default function SavedJobsPage() {
  const { savedIds } = useSavedJobs()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (savedIds.length === 0) { setLoading(false); return }
    // Fetch all open jobs and filter by saved IDs
    jobsAPI.list({ page_size: 100 })
      .then(r => {
        const all = r.data.results || r.data
        setJobs(all.filter(j => savedIds.includes(j.id)))
      })
      .finally(() => setLoading(false))
  }, [savedIds.length])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="section-label">My Collection</p>
        <h1 className="font-display font-bold text-3xl text-white">
          Saved <span className="gradient-text">Jobs</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>
          {savedIds.length} job{savedIds.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="skeleton h-32" />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <FiBookmark size={40} className="mx-auto mb-4" style={{ color: '#1a2340' }} />
          <p className="font-bold text-white mb-1">No saved jobs yet</p>
          <p className="text-sm mb-6" style={{ color: '#64748b' }}>
            Click the bookmark icon on any job to save it here
          </p>
          <Link to="/jobs" className="btn-primary inline-flex gap-2 text-sm">
            <FiSearch size={15} /> Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      )}
    </div>
  )
}
