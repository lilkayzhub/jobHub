import { useState, useEffect } from 'react'
import { authAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { FiUser, FiSave } from 'react-icons/fi'

export default function SeekerProfilePage() {
  const { user, refetchUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    authAPI.seekerProfile()
      .then(r => setProfile(r.data))
      .finally(() => setLoading(false))
  }, [])

  const set = (field) => (e) => setProfile(p => ({ ...p, [field]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await authAPI.updateSeekerProfile(profile)
      await refetchUser()
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-pulse space-y-4">
      {[1,2,3,4].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl" />)}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-100 to-primary-300 flex items-center justify-center">
          <FiUser className="text-primary-600" size={24} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">
            {user?.first_name} {user?.last_name}
          </h1>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-slate-800 border-b border-slate-100 pb-3">About You</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
            <textarea
              className="input min-h-[100px] resize-y"
              placeholder="Tell employers about yourself..."
              value={profile?.bio || ''}
              onChange={set('bio')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
              <input className="input" placeholder="e.g. Harare, Zimbabwe" value={profile?.location || ''} onChange={set('location')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Years of Experience</label>
              <input className="input" type="number" min="0" max="50" value={profile?.experience_years || 0} onChange={set('experience_years')} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Skills</label>
            <input className="input" placeholder="e.g. Python, React, Django (comma-separated)" value={profile?.skills || ''} onChange={set('skills')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Highest Education</label>
            <input className="input" placeholder="e.g. BSc Computer Science, University of Zimbabwe" value={profile?.education || ''} onChange={set('education')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">LinkedIn URL</label>
            <input className="input" type="url" placeholder="https://linkedin.com/in/yourname" value={profile?.linkedin_url || ''} onChange={set('linkedin_url')} />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          {saving
            ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            : <FiSave size={16} />
          }
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
