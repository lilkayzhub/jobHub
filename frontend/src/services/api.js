import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        const { data } = await axios.post('/api/auth/token/refresh/', { refresh })
        localStorage.setItem('access_token', data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login:    (data) => api.post('/auth/login/', data),
  me:       ()     => api.get('/auth/me/'),
  updateMe: (data) => api.patch('/auth/me/', data),
  seekerProfile:        ()     => api.get('/auth/seeker-profile/'),
  updateSeekerProfile:  (data) => api.patch('/auth/seeker-profile/', data),
  employerProfile:      ()     => api.get('/auth/employer-profile/'),
  updateEmployerProfile:(data) => api.patch('/auth/employer-profile/', data),
  forgotPassword: (email) => api.post('/auth/forgot-password/', { email }),
  resetPassword:  (data)  => api.post('/auth/reset-password/', data),
}

// ── Jobs ──────────────────────────────────────────────
export const jobsAPI = {
  list:       (params) => api.get('/jobs/', { params }),
  manage:     (params) => api.get('/jobs/manage/', { params }),
  detail:     (id)     => api.get(`/jobs/${id}/`),
  create:     (data)   => api.post('/jobs/manage/', data),
  update:     (id, data) => api.patch(`/jobs/${id}/`, data),
  delete:     (id)     => api.delete(`/jobs/${id}/`),
  categories: ()       => api.get('/jobs/categories/'),
}

// ── Applications ──────────────────────────────────────
export const applicationsAPI = {
  apply:       (data)   => api.post('/applications/apply/', data),
  myApps:      ()       => api.get('/applications/my/'),
  forJob:      (jobId)  => api.get(`/applications/job/${jobId}/`),
  updateStatus:(id, status) => api.patch(`/applications/${id}/status/`, { status }),
}

// ── Messaging ─────────────────────────────────────────
export const messagingAPI = {
  inbox:  ()     => api.get('/messages/inbox/'),
  sent:   ()     => api.get('/messages/sent/'),
  send:   (data) => api.post('/messages/send/', data),
  detail: (id)   => api.get(`/messages/${id}/`),
  archive:(id)   => api.patch(`/messages/${id}/`, { is_archived: true }),
  delete: (id)   => api.delete(`/messages/${id}/`),
}

export default api
