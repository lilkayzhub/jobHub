import { useState, useEffect } from 'react'
import { FiBookmark } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const STORAGE_KEY = (userId) => `jobhub_saved_jobs_${userId}`

export function useSavedJobs() {
  const { user } = useAuth()
  const [savedIds, setSavedIds] = useState([])

  useEffect(() => {
    if (!user) return
    const stored = localStorage.getItem(STORAGE_KEY(user.id))
    if (stored) setSavedIds(JSON.parse(stored))
  }, [user])

  const toggle = (jobId) => {
    if (!user) { toast.error('Please log in to save jobs'); return }
    const updated = savedIds.includes(jobId)
      ? savedIds.filter(id => id !== jobId)
      : [...savedIds, jobId]
    localStorage.setItem(STORAGE_KEY(user.id), JSON.stringify(updated))
    setSavedIds(updated)
    toast.success(savedIds.includes(jobId) ? 'Job removed from saved' : 'Job saved!')
  }

  return { savedIds, toggle, isSaved: (id) => savedIds.includes(id) }
}

export default function SaveJobButton({ jobId, size = 'md' }) {
  const { user } = useAuth()
  const { isSaved, toggle } = useSavedJobs()
  const saved = isSaved(jobId)

  const sizes = { sm: 14, md: 16, lg: 20 }
  const paddings = { sm: 'p-1.5', md: 'p-2', lg: 'p-2.5' }

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(jobId) }}
      className={`${paddings[size]} rounded-lg transition-all duration-200 active:scale-90`}
      style={{
        background: saved ? 'rgba(240,165,0,0.15)' : 'rgba(46,63,110,0.3)',
        border: `1px solid ${saved ? 'rgba(240,165,0,0.3)' : 'rgba(46,63,110,0.4)'}`,
        color: saved ? '#f0a500' : '#64748b',
        boxShadow: saved ? '0 0 10px rgba(240,165,0,0.2)' : 'none',
      }}
      title={saved ? 'Remove from saved' : 'Save job'}
    >
      <FiBookmark size={sizes[size]} fill={saved ? '#f0a500' : 'none'} />
    </button>
  )
}
