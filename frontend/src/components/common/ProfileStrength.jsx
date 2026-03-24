import { FiCheckCircle, FiCircle, FiTrendingUp } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function ProfileStrength({ user, profile, role }) {
  const checks = role === 'seeker' ? [
    { label: 'Full name added',       done: !!(user?.first_name && user?.last_name) },
    { label: 'Email verified',        done: !!user?.email },
    { label: 'Bio written',           done: !!(profile?.bio && profile.bio.length > 20) },
    { label: 'Skills listed',         done: !!(profile?.skills && profile.skills.length > 0) },
    { label: 'Location set',          done: !!profile?.location },
    { label: 'Education added',       done: !!profile?.education },
    { label: 'Experience years set',  done: profile?.experience_years > 0 },
    { label: 'LinkedIn URL added',    done: !!profile?.linkedin_url },
  ] : [
    { label: 'Company name set',      done: !!profile?.company_name },
    { label: 'Description written',   done: !!(profile?.company_description && profile.company_description.length > 20) },
    { label: 'Industry selected',     done: !!profile?.industry },
    { label: 'Location set',          done: !!profile?.location },
    { label: 'Company size added',    done: !!profile?.company_size },
    { label: 'Website added',         done: !!profile?.company_website },
  ]

  const completed = checks.filter(c => c.done).length
  const total = checks.length
  const pct = Math.round((completed / total) * 100)

  const strengthLabel = pct >= 90 ? 'Excellent' : pct >= 70 ? 'Strong' : pct >= 50 ? 'Good' : pct >= 30 ? 'Fair' : 'Weak'
  const strengthColor = pct >= 90 ? '#34d399' : pct >= 70 ? '#14b897' : pct >= 50 ? '#f0a500' : pct >= 30 ? '#fb923c' : '#f87171'

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <FiTrendingUp size={16} style={{ color: '#14b897' }} /> Profile Strength
        </h3>
        <span className="text-sm font-bold" style={{ color: strengthColor }}>{strengthLabel}</span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs" style={{ color: '#64748b' }}>{completed} of {total} complete</span>
          <span className="font-display font-bold text-lg" style={{ color: strengthColor }}>{pct}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(46,63,110,0.4)' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${strengthColor}, ${strengthColor}99)`, boxShadow: `0 0 10px ${strengthColor}50` }} />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-1.5 mb-4">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center gap-2.5">
            {c.done
              ? <FiCheckCircle size={14} style={{ color: '#34d399', flexShrink: 0 }} />
              : <FiCircle size={14} style={{ color: '#2e3f6e', flexShrink: 0 }} />
            }
            <span className="text-xs" style={{ color: c.done ? '#94a3b8' : '#475569', textDecoration: c.done ? 'line-through' : 'none' }}>
              {c.label}
            </span>
          </div>
        ))}
      </div>

      {pct < 100 && (
        <Link
          to={role === 'seeker' ? '/seeker/profile' : '/employer/profile'}
          className="btn-primary w-full text-xs justify-center py-2.5">
          Complete Profile →
        </Link>
      )}
    </div>
  )
}
