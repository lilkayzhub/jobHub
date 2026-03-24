import { Link } from 'react-router-dom'
import { FiMapPin, FiClock, FiDollarSign, FiArrowUpRight } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'
import SaveJobButton from '../common/SaveJobButton'

const typeBadge = { full_time:'badge-green', part_time:'badge-blue', contract:'badge-purple', internship:'badge-gold', remote:'badge-brand' }
const typeLabel = { full_time:'Full Time', part_time:'Part Time', contract:'Contract', internship:'Internship', remote:'Remote' }

export default function JobCard({ job }) {
  const salary = job.salary_min && job.salary_max
    ? `${job.salary_currency} ${Number(job.salary_min).toLocaleString()} – ${Number(job.salary_max).toLocaleString()}`
    : null
  const initials = (job.employer_name || 'JH').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['#14b897','#f0a500','#6366f1','#ec4899','#3b82f6']
  const color = colors[(job.employer_name || '').charCodeAt(0) % colors.length]

  return (
    <div className="job-card group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
          style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/jobs/${job.id}`} className="flex-1 min-w-0">
              <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors truncate mb-0.5">{job.title}</h3>
              <p className="text-sm" style={{ color: '#64748b' }}>{job.employer_name}</p>
            </Link>
            <div className="flex items-center gap-1.5 shrink-0">
              <SaveJobButton jobId={job.id} size="sm" />
              <Link to={`/jobs/${job.id}`}>
                <FiArrowUpRight size={15} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#14b897' }} />
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={typeBadge[job.job_type] || 'badge-slate'}>{typeLabel[job.job_type] || job.job_type}</span>
            {job.category_name && <span className="badge-slate">{job.category_name}</span>}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs" style={{ color: '#475569' }}>
            <span className="flex items-center gap-1"><FiMapPin size={11} />{job.location}</span>
            {salary && <span className="flex items-center gap-1"><FiDollarSign size={11} />{salary}</span>}
            <span className="flex items-center gap-1"><FiClock size={11} />{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
