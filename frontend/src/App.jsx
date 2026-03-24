import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProtectedRoute, RoleRoute } from './components/common/ProtectedRoute'
import Navbar from './components/common/Navbar'
import ChatBot from './components/chatbot/ChatBot'
import { jobsAPI } from './services/api'

// Auth
import LoginPage    from './pages/auth/LoginPage'
import RegisterPage        from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage  from './pages/auth/ResetPasswordPage'

// Shared
import LandingPage   from './pages/shared/LandingPage'
import JobsPage      from './pages/shared/JobsPage'
import JobDetailPage from './pages/shared/JobDetailPage'
import MessagesPage  from './pages/shared/MessagesPage'

// Employer
import EmployerDashboard        from './pages/employer/EmployerDashboard'
import PostJobPage              from './pages/employer/PostJobPage'
import EditJobPage              from './pages/employer/EditJobPage'
import EmployerApplicationsPage from './pages/employer/EmployerApplicationsPage'
import EmployerProfilePage      from './pages/employer/EmployerProfilePage'

// Seeker
import SeekerDashboard   from './pages/seeker/SeekerDashboard'
import SeekerProfilePage from './pages/seeker/SeekerProfilePage'
import SavedJobsPage    from './pages/seeker/SavedJobsPage'

function HomeRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/home" replace />
  return <Navigate to={user.role === 'employer' ? '/employer' : '/seeker'} replace />
}

function AppShell() {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    jobsAPI.list({ page_size: 50 })
      .then(r => setJobs(r.data.results || r.data))
      .catch(() => {})
  }, [])

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"         element={<HomeRedirect />} />
        <Route path="/home"     element={<LandingPage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password"  element={<ResetPasswordPage />} />
        <Route path="/jobs"     element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />

        {/* Employer */}
        <Route path="/employer" element={
          <ProtectedRoute><RoleRoute role="employer"><EmployerDashboard /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/employer/post-job" element={
          <ProtectedRoute><RoleRoute role="employer"><PostJobPage /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/employer/jobs/:id/edit" element={
          <ProtectedRoute><RoleRoute role="employer"><EditJobPage /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/employer/jobs/:id/applications" element={
          <ProtectedRoute><RoleRoute role="employer"><EmployerApplicationsPage /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/employer/profile" element={
          <ProtectedRoute><RoleRoute role="employer"><EmployerProfilePage /></RoleRoute></ProtectedRoute>
        } />

        {/* Seeker */}
        <Route path="/seeker" element={
          <ProtectedRoute><RoleRoute role="seeker"><SeekerDashboard /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/seeker/applications" element={
          <ProtectedRoute><RoleRoute role="seeker"><SeekerDashboard /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/seeker/saved-jobs" element={
          <ProtectedRoute><RoleRoute role="seeker"><SavedJobsPage /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/seeker/profile" element={
          <ProtectedRoute><RoleRoute role="seeker"><SeekerProfilePage /></RoleRoute></ProtectedRoute>
        } />

        {/* Shared protected */}
        <Route path="/messages" element={
          <ProtectedRoute><MessagesPage /></ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={
          <div className="max-w-xl mx-auto px-4 py-20 text-center">
            <div className="font-display font-bold text-8xl mb-4" style={{ color: '#0d1220' }}>404</div>
            <p className="mb-6" style={{ color: '#64748b' }}>Page not found</p>
            <a href="/" className="btn-primary inline-flex">Go Home</a>
          </div>
        } />
      </Routes>

      <ChatBot jobs={jobs} />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          duration: 3500,
          style: {
            background: 'rgba(13,18,32,0.95)', color: '#e2e8f0',
            border: '1px solid rgba(46,63,110,0.5)', borderRadius: '12px', backdropFilter: 'blur(20px)',
          },
        }} />
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}
