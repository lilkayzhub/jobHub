import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiBriefcase, FiUsers, FiZap, FiArrowRight, FiCheckCircle, FiMessageCircle } from 'react-icons/fi'

const stats = [
  { value: '500+', label: 'Jobs Posted' },
  { value: '1,200+', label: 'Job Seekers' },
  { value: '150+', label: 'Companies' },
  { value: '98%', label: 'Satisfaction' },
]

const features = [
  { icon: FiSearch,       title: 'Smart Job Search',     desc: 'Search by keyword, location, category and experience level to find your perfect match instantly.' },
  { icon: FiBriefcase,    title: 'Easy Applications',    desc: 'Apply with one click, attach your cover letter, and track every application from your dashboard.' },
  { icon: FiUsers,        title: 'Employer Tools',       desc: 'Post jobs, manage applications, update candidate statuses and message applicants — all in one place.' },
  { icon: FiMessageCircle,title: 'Built-in Messaging',   desc: 'Communicate directly with employers or candidates through our secure internal messaging system.' },
  { icon: FiZap,          title: 'AI Career Assistant',  desc: 'JobBot helps you find the right jobs, write cover letters, and prepare for interviews — for free.' },
  { icon: FiCheckCircle,  title: 'Real-time Notifications', desc: 'Employers get instant email alerts when someone applies. Never miss a great candidate again.' },
]

const steps = [
  { step: '01', title: 'Create your account', desc: 'Sign up as a Job Seeker or Employer in under 2 minutes.' },
  { step: '02', title: 'Set up your profile',  desc: 'Add your skills, experience and location to stand out.' },
  { step: '03', title: 'Find & apply',          desc: 'Browse jobs, apply with a cover letter, and track your status.' },
]

export default function LandingPage() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/jobs?search=${encodeURIComponent(search.trim())}`)
    else navigate('/jobs')
  }

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse,rgba(20,184,151,0.1) 0%,transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse,rgba(240,165,0,0.06) 0%,transparent 70%)' }} />

        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-3xl animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-bold"
              style={{ background: 'rgba(20,184,151,0.1)', border: '1px solid rgba(20,184,151,0.2)', color: '#2dd4aa' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }} />
              Zimbabwe's #1 Job Platform
            </div>

            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6">
              Find Your Dream<br />
              <span className="gradient-text">Career Today</span>
            </h1>

            <p className="text-lg sm:text-xl mb-8 max-w-xl" style={{ color: '#64748b' }}>
              JobHub connects talented professionals with top employers across Zimbabwe. Search thousands of jobs and land your next role.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-10 max-w-2xl">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: '#475569' }} />
                <input
                  className="input pl-12 py-4 text-base"
                  placeholder="Job title, skills, company..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                <FiSearch size={18} /> Search Jobs
              </button>
            </form>

            {/* Popular searches */}
            <div className="flex flex-wrap items-center gap-2 mb-16">
              <span className="text-xs" style={{ color: '#475569' }}>Popular:</span>
              {['Software Engineer', 'Accountant', 'Teacher', 'Sales', 'Driver'].map(term => (
                <button key={term} onClick={() => navigate(`/jobs?search=${encodeURIComponent(term)}`)}
                  className="text-xs px-3 py-1.5 rounded-full transition-all duration-150"
                  style={{ background: 'rgba(46,63,110,0.3)', color: '#94a3b8', border: '1px solid rgba(46,63,110,0.4)' }}>
                  {term}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map(s => (
                <div key={s.label} className="text-center">
                  <div className="font-display font-bold text-2xl sm:text-3xl gradient-text">{s.value}</div>
                  <div className="text-xs mt-1" style={{ color: '#475569' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating cards */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 space-y-3 animate-float" style={{ width: '280px' }}>
          {[
            { title: 'Software Engineer', company: 'TechZim',    type: 'Full Time', color: '#14b897' },
            { title: 'Finance Manager',   company: 'ZB Bank',    type: 'Full Time', color: '#f0a500' },
            { title: 'UI/UX Designer',    company: 'Creative Co',type: 'Remote',    color: '#6366f1' },
          ].map((job, i) => (
            <div key={i} className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                  style={{ background: `${job.color}18`, border: `1px solid ${job.color}30`, color: job.color }}>
                  {job.company[0]}
                </div>
                <div>
                  <p className="font-bold text-white text-xs">{job.title}</p>
                  <p className="text-xs" style={{ color: '#64748b' }}>{job.company}</p>
                </div>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-md font-bold"
                  style={{ background: `${job.color}15`, color: job.color, border: `1px solid ${job.color}25` }}>
                  {job.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label">Why JobHub</p>
            <h2 className="font-display font-bold text-4xl text-white mb-4">Everything you need to <span className="gradient-text">succeed</span></h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#64748b' }}>Whether you're searching for your first job or hiring your next star employee, JobHub has the tools.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="glass-card p-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(20,184,151,0.1)', border: '1px solid rgba(20,184,151,0.2)' }}>
                  <f.icon size={20} style={{ color: '#14b897' }} />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'rgba(13,18,32,0.5)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label">How it works</p>
            <h2 className="font-display font-bold text-4xl text-white mb-4">Get hired in <span className="gradient-text">3 simple steps</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 font-display font-bold text-xl"
                  style={{ background: 'rgba(20,184,151,0.1)', border: '1px solid rgba(20,184,151,0.25)', color: '#14b897' }}>
                  {s.step}
                </div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm" style={{ color: '#64748b' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center,rgba(20,184,151,0.08) 0%,transparent 70%)' }} />
            <div className="relative">
              <p className="section-label">Get Started Today</p>
              <h2 className="font-display font-bold text-4xl text-white mb-4">Ready for your <span className="gradient-text">next opportunity?</span></h2>
              <p className="mb-8" style={{ color: '#64748b' }}>Join thousands of professionals already using JobHub. It's completely free.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-primary text-base px-8 py-4 flex items-center justify-center gap-2">Create Free Account <FiArrowRight size={16} /></Link>
                <Link to="/jobs" className="btn-secondary text-base px-8 py-4 flex items-center justify-center gap-2"><FiSearch size={16} /> Browse Jobs</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8" style={{ borderTop: '1px solid rgba(46,63,110,0.4)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#14b897,#0d9478)' }}>
              <FiZap size={13} className="text-white" />
            </div>
            <span className="font-display font-bold text-white">Job<span className="gradient-text">Hub</span></span>
          </div>
          <p className="text-xs" style={{ color: '#334155' }}>© {new Date().getFullYear()} JobHub — Zandile Solutions. Built for Zimbabwe's workforce.</p>
          <div className="flex items-center gap-4">
            <Link to="/jobs"     className="text-xs transition-colors" style={{ color: '#475569' }}>Browse Jobs</Link>
            <Link to="/register" className="text-xs transition-colors" style={{ color: '#475569' }}>Sign Up</Link>
            <Link to="/login"    className="text-xs transition-colors" style={{ color: '#475569' }}>Login</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
