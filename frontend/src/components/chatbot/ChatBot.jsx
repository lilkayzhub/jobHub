import { useState, useRef, useEffect } from 'react'
import { FiMessageCircle, FiX, FiSend, FiMinus, FiZap } from 'react-icons/fi'

// Smart rule-based job assistant — no API key needed
function generateReply(input, jobs) {
  const msg = input.toLowerCase()

  // Greetings
  if (/^(hi|hello|hey|good morning|good afternoon|howzit|hie)/.test(msg)) {
    return "👋 Hello! I'm JobBot, your career assistant. I can help you:\n\n- **Find jobs** matching your skills\n- **Search by location** or category\n- **Write a cover letter**\n- **Give career tips**\n\nWhat are you looking for today?"
  }

  // How many jobs
  if (/how many jobs|number of jobs|total jobs/.test(msg)) {
    const open = jobs.filter(j => j.status === 'open' || !j.status)
    return `📊 There are currently **${open.length} open jobs** on JobHub.\n\nWould you like me to help you find one that matches your skills?`
  }

  // Cover letter help
  if (/cover letter|covering letter/.test(msg)) {
    return "✍️ Here's a simple cover letter structure:\n\n- **Opening** — State the job you're applying for and where you saw it\n- **Why you?** — Highlight your top 2-3 skills that match the job\n- **Experience** — Mention a relevant achievement or project\n- **Closing** — Express enthusiasm and request an interview\n\nKeep it to one page and address it to the hiring manager if possible. Want me to help with a specific job?"
  }

  // CV / Resume tips
  if (/cv|resume|curriculum/.test(msg)) {
    return "📄 Top CV tips for Zimbabwean job seekers:\n\n- Keep it to **2 pages maximum**\n- Put your **contact details** at the top\n- List experience in **reverse chronological order**\n- Include **skills** relevant to the job\n- Add your **education** and any certifications\n- Proofread carefully — no spelling mistakes!\n\nWould you like tips for a specific industry?"
  }

  // Interview tips
  if (/interview|prepare|preparation/.test(msg)) {
    return "🎯 Interview preparation tips:\n\n- **Research the company** before you go\n- Prepare answers for 'Tell me about yourself'\n- Have examples of your achievements ready\n- Dress professionally and arrive early\n- Prepare **2-3 questions** to ask the interviewer\n- Follow up with a thank you email after\n\nGood luck! You've got this! 💪"
  }

  // Salary questions
  if (/salary|pay|wage|earn|income/.test(msg)) {
    const withSalary = jobs.filter(j => j.salary_min || j.salary_max)
    if (withSalary.length > 0) {
      const list = withSalary.slice(0, 3).map(j =>
        `- **${j.title}** at ${j.employer_name || 'Company'}: ${j.salary_currency || 'USD'} ${j.salary_min ? Number(j.salary_min).toLocaleString() : '?'}${j.salary_max ? '–' + Number(j.salary_max).toLocaleString() : '+'}`
      ).join('\n')
      return `💰 Here are some jobs with listed salaries:\n\n${list}\n\nTip: Always research industry salary ranges before negotiating. Would you like more details on any of these?`
    }
    return "💰 Most jobs on JobHub currently don't list a salary publicly. It's common to discuss salary during the interview.\n\nTip: Research the market rate for your role before negotiating. Would you like interview salary negotiation tips?"
  }

  // Remote jobs
  if (/remote|work from home|wfh|online job/.test(msg)) {
    const remote = jobs.filter(j => j.job_type === 'remote' || /remote/i.test(j.title + ' ' + j.description))
    if (remote.length > 0) {
      const list = remote.slice(0, 4).map(j => `- **${j.title}** at ${j.employer_name || 'Company'} — ${j.location}`).join('\n')
      return `🏠 Here are **${remote.length} remote job(s)** available:\n\n${list}\n\nClick on any job to see full details and apply. Want me to filter by a specific skill?`
    }
    return "🏠 There are no remote jobs listed right now, but new jobs are posted regularly.\n\nTry browsing the Jobs page and filtering by **'Remote'** type. Want help with anything else?"
  }

  // Internship
  if (/intern|internship|attachment|industrial/.test(msg)) {
    const internships = jobs.filter(j => j.job_type === 'internship' || /intern/i.test(j.title))
    if (internships.length > 0) {
      const list = internships.slice(0, 4).map(j => `- **${j.title}** at ${j.employer_name || 'Company'} — ${j.location}`).join('\n')
      return `🎓 Found **${internships.length} internship(s)**:\n\n${list}\n\nClick any to apply. Would you like tips on applying for internships?`
    }
    return "🎓 No internships are listed at the moment. Check back soon as new opportunities are posted regularly!\n\nMeanwhile, would you like tips on how to make your CV stand out for internship applications?"
  }

  // Entry level
  if (/entry.?level|no experience|fresh|graduate|just graduated|school leaver/.test(msg)) {
    const entry = jobs.filter(j => j.experience_level === 'entry' || /entry|junior|graduate/i.test(j.title))
    if (entry.length > 0) {
      const list = entry.slice(0, 4).map(j => `- **${j.title}** at ${j.employer_name || 'Company'} — ${j.location}`).join('\n')
      return `🌱 Great news! Found **${entry.length} entry-level job(s)**:\n\n${list}\n\nThese are perfect if you're just starting out. Want tips on writing a CV with no experience?`
    }
    return "🌱 No entry-level jobs are listed right now, but don't give up!\n\nTips for getting your first job:\n- **Volunteer** to build experience\n- Take **free online courses** (Coursera, YouTube)\n- Apply anyway — some employers value attitude over experience\n\nWant more advice?"
  }

  // Location search
  const cities = ['harare', 'bulawayo', 'mutare', 'gweru', 'kwekwe', 'masvingo', 'chinhoyi', 'bindura']
  const foundCity = cities.find(city => msg.includes(city))
  if (foundCity || /location|where|city|town/.test(msg)) {
    const cityJobs = foundCity
      ? jobs.filter(j => j.location?.toLowerCase().includes(foundCity))
      : jobs
    if (cityJobs.length > 0) {
      const list = cityJobs.slice(0, 4).map(j => `- **${j.title}** at ${j.employer_name || 'Company'} — ${j.location}`).join('\n')
      const label = foundCity ? foundCity.charAt(0).toUpperCase() + foundCity.slice(1) : 'your area'
      return `📍 Found **${cityJobs.length} job(s)** in ${label}:\n\n${list}\n\nWant me to filter these further by category or type?`
    }
    return `📍 No jobs found in ${foundCity || 'that location'} right now. Try browsing all jobs and using the location search filter.\n\nWould you like to search by job type instead?`
  }

  // Tech / IT jobs
  if (/tech|it |software|developer|programmer|coding|computer|web|digital|data/.test(msg)) {
    const tech = jobs.filter(j => /tech|it|software|developer|web|data|digital|computer|system/i.test(j.title + ' ' + (j.category_name || '') + ' ' + (j.description || '')))
    if (tech.length > 0) {
      const list = tech.slice(0, 4).map(j => `- **${j.title}** at ${j.employer_name || 'Company'} — ${j.location}`).join('\n')
      return `💻 Found **${tech.length} tech job(s)**:\n\n${list}\n\nClick any listing to see requirements and apply. What tech skills do you have?`
    }
    return "💻 No tech jobs are listed right now, but they come up often!\n\nTip: Make sure your profile lists your tech skills so employers can find you. What technologies do you know?"
  }

  // Finance / accounting
  if (/finance|account|banking|audit|tax|bookkeep/.test(msg)) {
    const finance = jobs.filter(j => /finance|account|bank|audit|tax/i.test(j.title + ' ' + (j.category_name || '')))
    if (finance.length > 0) {
      const list = finance.slice(0, 4).map(j => `- **${j.title}** at ${j.employer_name || 'Company'} — ${j.location}`).join('\n')
      return `💼 Found **${finance.length} finance/accounting job(s)**:\n\n${list}\n\nWould you like tips on applying for finance roles?`
    }
    return "💼 No finance jobs listed right now. Check back soon!\n\nWant tips on what qualifications are most valued in finance roles in Zimbabwe?"
  }

  // How to apply
  if (/how to apply|apply|application|submit/.test(msg)) {
    return "📝 Here's how to apply on JobHub:\n\n- **Browse jobs** on the Jobs page\n- Click any job to see full details\n- Click the **'Apply Now'** button\n- Write a cover letter (optional but recommended)\n- Click **Submit Application**\n\nThe employer gets notified instantly by email! You can track your application status in your dashboard.\n\nWould you like help finding a job to apply for?"
  }

  // Show all jobs / general job search
  if (/show|list|all jobs|available|what jobs|any jobs|find job|looking for job/.test(msg)) {
    const open = jobs.filter(j => j.status === 'open' || !j.status)
    if (open.length === 0) {
      return "📋 There are no open jobs listed right now. Check back soon — new jobs are posted regularly!\n\nIn the meantime, make sure your **profile is complete** so employers can find you. Want profile tips?"
    }
    const list = open.slice(0, 5).map(j => `- **${j.title}** at ${j.employer_name || 'Company'} — ${j.location}`).join('\n')
    return `📋 Here are **${open.length} open jobs** on JobHub:\n\n${list}${open.length > 5 ? `\n\n...and ${open.length - 5} more on the Jobs page.` : ''}\n\nWant me to filter by your skills or location?`
  }

  // Keyword search in job titles
  const words = msg.replace(/[^a-z\s]/g, '').split(' ').filter(w => w.length > 3)
  if (words.length > 0) {
    const matched = jobs.filter(j => {
      const searchStr = `${j.title} ${j.category_name || ''} ${j.description || ''}`.toLowerCase()
      return words.some(w => searchStr.includes(w))
    })
    if (matched.length > 0) {
      const list = matched.slice(0, 4).map(j => `- **${j.title}** at ${j.employer_name || 'Company'} — ${j.location}`).join('\n')
      return `🔍 Found **${matched.length} job(s)** matching your search:\n\n${list}\n\nClick any job to view details and apply. Want to refine the search?`
    }
  }

  // Default fallback
  return "🤖 I'm here to help! Here's what I can do:\n\n- **Find jobs** — try 'show me tech jobs' or 'jobs in Harare'\n- **Career tips** — ask about CVs, cover letters or interviews\n- **Platform help** — ask 'how do I apply for a job'\n\nWhat would you like help with?"
}

export default function ChatBot({ jobs = [] }) {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "👋 Hi! I'm **JobBot**, your career assistant. I can help you find jobs, write cover letters, and give career advice.\n\nWhat are you looking for today?",
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100) }
  }, [open])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return
    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600)) // natural delay
    const reply = generateReply(text, jobs)
    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    if (!open) setUnread(u => u + 1)
    setLoading(false)
  }

  const sendQuickPrompt = async (prompt) => {
    setMessages(prev => [...prev, { role: 'user', content: prompt }])
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const reply = generateReply(prompt, jobs)
    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const renderContent = (text) => {
    return text.split('\n').map((line, i, arr) => {
      const parts = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? <strong key={j} className="font-bold text-white">{part}</strong> : part
      )
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ')
      return (
        <span key={i}>
          {isBullet ? (
            <span className="flex items-start gap-2 my-0.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#14b897' }} />
              <span>{parts}</span>
            </span>
          ) : <span>{parts}</span>}
          {i < arr.length - 1 && !isBullet && <br />}
        </span>
      )
    })
  }

  const quickPrompts = ['Show all jobs', 'Entry level jobs', 'Cover letter tips', 'How to apply']

  return (
    <>
      <button
        onClick={() => { setOpen(true); setMinimized(false) }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ background: 'linear-gradient(135deg,#14b897,#0d9478)', boxShadow: '0 0 30px rgba(20,184,151,0.5)', display: open ? 'none' : 'flex' }}
      >
        <FiMessageCircle size={22} className="text-white" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
            style={{ background: '#ef4444', color: 'white' }}>{unread}</span>
        )}
      </button>

      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl overflow-hidden"
          style={{ width: '380px', height: minimized ? '60px' : '560px', background: 'rgba(8,12,20,0.97)', border: '1px solid rgba(46,63,110,0.6)', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', backdropFilter: 'blur(24px)' }}>

          <div className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ background: 'linear-gradient(135deg,rgba(20,184,151,0.15),rgba(13,149,120,0.1))', borderBottom: '1px solid rgba(46,63,110,0.4)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#14b897,#0d9478)', boxShadow: '0 0 12px rgba(20,184,151,0.4)' }}>
                <FiZap size={15} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">JobBot</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 4px rgba(52,211,153,0.8)' }} />
                  <span className="text-xs" style={{ color: '#64748b' }}>Career Assistant • Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMinimized(m => !m)} className="btn-ghost p-1.5" style={{ color: '#64748b' }}><FiMinus size={15} /></button>
              <button onClick={() => setOpen(false)} className="btn-ghost p-1.5" style={{ color: '#64748b' }}><FiX size={15} /></button>
            </div>
          </div>

          {!minimized && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-md flex items-center justify-center mr-2 mt-0.5 shrink-0"
                        style={{ background: 'linear-gradient(135deg,#14b897,#0d9478)' }}>
                        <FiZap size={11} className="text-white" />
                      </div>
                    )}
                    <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                      style={msg.role === 'user'
                        ? { background: 'linear-gradient(135deg,#14b897,#0d9478)', color: '#080c14', fontWeight: '500', borderBottomRightRadius: '4px' }
                        : { background: 'rgba(19,26,46,0.8)', color: '#cbd5e1', border: '1px solid rgba(46,63,110,0.4)', borderBottomLeftRadius: '4px' }}>
                      {renderContent(msg.content)}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#14b897,#0d9478)' }}>
                      <FiZap size={11} className="text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1"
                      style={{ background: 'rgba(19,26,46,0.8)', border: '1px solid rgba(46,63,110,0.4)' }}>
                      {[0,1,2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                          style={{ animation: `bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {messages.length === 1 && (
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                  {quickPrompts.map(prompt => (
                    <button key={prompt} onClick={() => sendQuickPrompt(prompt)}
                      className="text-xs px-3 py-1.5 rounded-lg transition-all duration-150"
                      style={{ background: 'rgba(20,184,151,0.08)', color: '#2dd4aa', border: '1px solid rgba(20,184,151,0.2)' }}>
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <div className="px-4 py-3 shrink-0" style={{ borderTop: '1px solid rgba(46,63,110,0.4)' }}>
                <div className="flex items-end gap-2">
                  <textarea ref={inputRef} rows={1}
                    className="flex-1 text-sm resize-none outline-none"
                    placeholder="Ask me anything about jobs..."
                    value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                    style={{ background: 'rgba(19,26,46,0.6)', border: '1px solid rgba(46,63,110,0.5)', borderRadius: '12px', padding: '10px 14px', color: 'white', maxHeight: '100px', scrollbarWidth: 'none' }}
                    onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px' }}
                  />
                  <button onClick={sendMessage} disabled={!input.trim() || loading}
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 active:scale-90"
                    style={{ background: input.trim() && !loading ? 'linear-gradient(135deg,#14b897,#0d9478)' : 'rgba(19,26,46,0.6)', border: '1px solid rgba(46,63,110,0.5)', color: input.trim() && !loading ? '#080c14' : '#334155' }}>
                    <FiSend size={15} />
                  </button>
                </div>
                <p className="text-center text-xs mt-2" style={{ color: '#1e2d4a' }}>JobBot — Smart Career Assistant</p>
              </div>
            </>
          )}
        </div>
      )}
      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }`}</style>
    </>
  )
}
