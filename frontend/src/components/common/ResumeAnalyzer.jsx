import { useState } from 'react'
import { FiUpload, FiFileText, FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi'

// Rule-based CV analyzer — no API needed
function analyzeResume(text) {
  const t = text.toLowerCase()
  const scores = []
  const tips = []
  const strengths = []

  // Contact info
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/.test(t)
  const hasPhone = /(\+?263|0)?7[1-9]\d{7}|(\+?\d{1,3})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(t)
  if (hasEmail) { scores.push(10); strengths.push('Email address found') }
  else { tips.push('Add your email address') }
  if (hasPhone) { scores.push(10); strengths.push('Phone number found') }
  else { tips.push('Add your phone number') }

  // Length check
  const wordCount = text.split(/\s+/).filter(Boolean).length
  if (wordCount > 300) { scores.push(15); strengths.push('Good CV length') }
  else { tips.push('Your CV seems short — add more detail about your experience') }

  // Education
  const hasEducation = /education|degree|diploma|certificate|university|college|school|matric|a.?level|o.?level/.test(t)
  if (hasEducation) { scores.push(15); strengths.push('Education section present') }
  else { tips.push('Add an Education section') }

  // Experience
  const hasExperience = /experience|work(ed|ing)?|employed|position|role|job|internship|volunteer/.test(t)
  if (hasExperience) { scores.push(15); strengths.push('Work experience mentioned') }
  else { tips.push('Add a Work Experience section') }

  // Skills
  const hasSkills = /skill|proficient|knowledge|expertise|able to|competent/.test(t)
  if (hasSkills) { scores.push(10); strengths.push('Skills section found') }
  else { tips.push('Add a Skills section listing your key abilities') }

  // Action verbs
  const actionVerbs = ['managed','developed','created','led','improved','designed','implemented','achieved','increased','reduced','built','delivered','coordinated','trained']
  const foundVerbs = actionVerbs.filter(v => t.includes(v))
  if (foundVerbs.length >= 3) { scores.push(10); strengths.push(`Strong action verbs used (${foundVerbs.slice(0,3).join(', ')})`) }
  else { tips.push('Use strong action verbs like: managed, developed, achieved, improved') }

  // Summary/Objective
  const hasSummary = /summary|objective|profile|about me|career goal/.test(t)
  if (hasSummary) { scores.push(10); strengths.push('Professional summary/profile included') }
  else { tips.push('Add a professional summary at the top of your CV') }

  // LinkedIn or references
  const hasLinkedIn = /linkedin/.test(t)
  const hasReferences = /reference|referee/.test(t)
  if (hasLinkedIn) { scores.push(5); strengths.push('LinkedIn profile included') }
  if (hasReferences) { scores.push(5); strengths.push('References section included') }
  else { tips.push('Add references or write "References available on request"') }

  const total = scores.reduce((a, b) => a + b, 0)
  const pct = Math.min(total, 100)

  const rating = pct >= 80 ? 'Excellent' : pct >= 65 ? 'Strong' : pct >= 50 ? 'Good' : pct >= 35 ? 'Needs Work' : 'Weak'
  const ratingColor = pct >= 80 ? '#34d399' : pct >= 65 ? '#14b897' : pct >= 50 ? '#f0a500' : pct >= 35 ? '#fb923c' : '#f87171'

  return { score: pct, rating, ratingColor, strengths, tips, wordCount }
}

export default function ResumeAnalyzer() {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFileName(file.name)
    setLoading(true)
    setResult(null)

    try {
      const text = await file.text()
      await new Promise(r => setTimeout(r, 1200)) // simulate analysis
      const analysis = analyzeResume(text)
      setResult(analysis)
    } catch {
      setResult({ error: true })
    } finally { setLoading(false) }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-secondary flex items-center gap-2 text-sm">
        <FiFileText size={15} /> Analyze My CV
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden"
            style={{ background: 'rgba(8,12,20,0.98)', border: '1px solid rgba(46,63,110,0.6)', boxShadow: '0 30px 80px rgba(0,0,0,0.7)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(46,63,110,0.4)' }}>
              <div>
                <h2 className="font-display font-bold text-white">CV Analyzer</h2>
                <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Upload your CV as a .txt file for instant feedback</p>
              </div>
              <button onClick={() => { setOpen(false); setResult(null); setFileName('') }} style={{ color: '#475569' }}>
                <FiX size={18} />
              </button>
            </div>

            <div className="p-6">
              {/* Upload area */}
              {!result && !loading && (
                <label className="flex flex-col items-center justify-center w-full h-36 rounded-xl cursor-pointer transition-all duration-200"
                  style={{ border: '2px dashed rgba(46,63,110,0.6)', background: 'rgba(19,26,46,0.3)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(20,184,151,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(46,63,110,0.6)'}>
                  <FiUpload size={28} className="mb-3" style={{ color: '#475569' }} />
                  <p className="text-sm font-bold text-white">Click to upload your CV</p>
                  <p className="text-xs mt-1" style={{ color: '#475569' }}>Supports .txt files</p>
                  <input type="file" accept=".txt" className="hidden" onChange={handleFile} />
                </label>
              )}

              {/* Loading */}
              {loading && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-2 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'rgba(46,63,110,0.4)', borderTopColor: '#14b897' }} />
                  <p className="font-bold text-white">Analyzing your CV...</p>
                  <p className="text-sm mt-1" style={{ color: '#64748b' }}>Checking {fileName}</p>
                </div>
              )}

              {/* Results */}
              {result && !result.error && (
                <div className="space-y-5">
                  {/* Score */}
                  <div className="text-center py-4">
                    <div className="font-display font-bold text-5xl mb-1" style={{ color: result.ratingColor }}>
                      {result.score}%
                    </div>
                    <div className="font-bold text-lg" style={{ color: result.ratingColor }}>{result.rating}</div>
                    <p className="text-xs mt-1" style={{ color: '#64748b' }}>{result.wordCount} words detected</p>
                    <div className="w-full h-2.5 rounded-full overflow-hidden mt-3" style={{ background: 'rgba(46,63,110,0.4)' }}>
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${result.score}%`, background: `linear-gradient(90deg,${result.ratingColor},${result.ratingColor}88)` }} />
                    </div>
                  </div>

                  {/* Strengths */}
                  {result.strengths.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#34d399' }}>✅ Strengths</p>
                      <div className="space-y-1.5">
                        {result.strengths.map((s, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
                            <FiCheckCircle size={13} style={{ color: '#34d399', flexShrink: 0 }} />
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {result.tips.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#f0a500' }}>💡 Improvements</p>
                      <div className="space-y-1.5">
                        {result.tips.map((t, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm" style={{ color: '#94a3b8' }}>
                            <FiAlertCircle size={13} style={{ color: '#f0a500', flexShrink: 0, marginTop: '2px' }} />
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button onClick={() => { setResult(null); setFileName('') }} className="btn-secondary w-full text-sm">
                    Analyze Another CV
                  </button>
                </div>
              )}

              {result?.error && (
                <div className="text-center py-8">
                  <p className="text-sm" style={{ color: '#f87171' }}>Could not read file. Please use a .txt file.</p>
                  <button onClick={() => { setResult(null); setFileName('') }} className="btn-secondary mt-4 text-sm">Try Again</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
