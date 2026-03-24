import { useState, useEffect } from 'react'
import { authAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { FiSave, FiBriefcase, FiGlobe, FiMapPin, FiUsers } from 'react-icons/fi'

const SIZES = ['1-10', '11-50', '51-200', '201-500', '500+']
const INDUSTRIES = ['Technology','Finance','Healthcare','Education','Marketing','Engineering','Retail','Construction','Agriculture','Media','NGO','Government','Other']

export default function EmployerProfilePage() {
  const { user, refetchUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    authAPI.employerProfile()
      .then(r => setProfile(r.data))
      .finally(() => setLoading(false))
  }, [])

  const set = field => e => setProfile(p => ({ ...p, [field]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await authAPI.updateEmployerProfile(profile)
      await refetchUser()
      toast.success('Company profile updated!')
    } catch { toast.error('Failed to save profile') }
    finally { setSaving(false) }
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-4">
      {[1,2,3].map(i => <div key={i} className="skeleton h-20" />)}
    </div>
  )

  const initials = (profile?.company_name || user?.first_name || 'C').charAt(0).toUpperCase()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-bold text-2xl"
          style={{ background: 'linear-gradient(135deg,rgba(20,184,151,0.2),rgba(13,149,120,0.1))', border: '1px solid rgba(20,184,151,0.3)', color: '#14b897' }}>
          {initials}
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-white">{profile?.company_name || 'Your Company'}</h1>
          <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Company Info */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-bold text-white pb-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(46,63,110,0.4)' }}>
            <FiBriefcase size={16} style={{ color: '#14b897' }} /> Company Information
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#475569' }}>Company Name *</label>
            <input className="input" placeholder="e.g. Zandile Solutions" value={profile?.company_name || ''} onChange={set('company_name')} required />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#475569' }}>Company Description</label>
            <textarea className="input min-h-[100px] resize-y"
              placeholder="Tell job seekers about your company, culture, and mission..."
              value={profile?.company_description || ''} onChange={set('company_description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#475569' }}>Industry</label>
              <select className="input" value={profile?.industry || ''} onChange={set('industry')}>
                <option value="">Select industry...</option>
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#475569' }}>Company Size</label>
              <select className="input" value={profile?.company_size || ''} onChange={set('company_size')}>
                <option value="">Select size...</option>
                {SIZES.map(s => <option key={s}>{s} employees</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-bold text-white pb-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(46,63,110,0.4)' }}>
            <FiMapPin size={16} style={{ color: '#14b897' }} /> Contact & Location
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#475569' }}>Location</label>
            <input className="input" placeholder="e.g. Harare, Zimbabwe" value={profile?.location || ''} onChange={set('location')} />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#475569' }}>
              <FiGlobe size={12} className="inline mr-1" />Company Website
            </label>
            <input className="input" type="url" placeholder="https://yourcompany.com" value={profile?.company_website || ''} onChange={set('company_website')} />
          </div>
        </div>

        {/* Preview card */}
        {profile?.company_name && (
          <div className="glass-card p-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#334155' }}>Profile Preview</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold"
                style={{ background: 'rgba(20,184,151,0.1)', border: '1px solid rgba(20,184,151,0.2)', color: '#14b897' }}>
                {initials}
              </div>
              <div>
                <p className="font-bold text-white">{profile.company_name}</p>
                <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: '#64748b' }}>
                  {profile.industry && <span>{profile.industry}</span>}
                  {profile.location && <span className="flex items-center gap-1"><FiMapPin size={10}/>{profile.location}</span>}
                  {profile.company_size && <span className="flex items-center gap-1"><FiUsers size={10}/>{profile.company_size}</span>}
                </div>
              </div>
            </div>
            {profile.company_description && (
              <p className="text-sm mt-4 leading-relaxed" style={{ color: '#64748b' }}>
                {profile.company_description.slice(0, 150)}{profile.company_description.length > 150 ? '...' : ''}
              </p>
            )}
          </div>
        )}

        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 w-full justify-center pb-8">
          {saving ? <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: '#080c14', borderTopColor: 'transparent' }} /> : <FiSave size={16} />}
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
