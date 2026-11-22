
import { BookOpen, UserPlus, Search, ListChecks, ShieldAlert, FileText, MessageCircle, LayoutDashboard } from 'lucide-react'

const sections = [
  { icon: <UserPlus />, title: '1. Registration and Login', text: 'Create an account using your name, email address and password. After registration, log in using your registered email and password.' },
  { icon: <Search />, title: '2. Explore Government Schemes', text: 'Open the Schemes section to browse the welfare schemes listed on Adhikar Setu. Read the benefits, eligibility information, application process and available official links.' },
  { icon: <ListChecks />, title: '3. Check Eligibility', text: 'Open the Eligibility Checker and provide the requested information. Review the result as preliminary guidance. Final eligibility is decided by the relevant government department.' },
  { icon: <ShieldAlert />, title: '4. Use Scam Shield', text: 'Submit suspicious message or website information for an awareness check. Treat the result as guidance, not a guarantee that a message or website is safe.' },
  { icon: <FileText />, title: '5. Understand Notices', text: 'Use the Notice section to get help understanding the text of a notice. Always refer to the original notice and issuing authority for official decisions.' },
  { icon: <MessageCircle />, title: '6. Ask Adhikar Setu Assistant', text: 'Ask questions about schemes and features available on this website. The assistant is limited to Adhikar Setu topics and may not know every government rule or update.' },
  { icon: <LayoutDashboard />, title: '7. Your Dashboard', text: 'Visit your dashboard to view the account information and user-specific features currently provided by the platform. Sign out when using a shared device.' }
]

export default function Guide() {
  return (
    <section className="page gov-guide-page">
      <div className="gov-guide-heading">
        <BookOpen size={34} />
        <div><span className="gov-section-label">HELP AND INFORMATION</span><h1>Adhikar Setu User Guide</h1></div>
      </div>
      <p className="muted">Welcome to Adhikar Setu. This guide explains how to use the services available on this platform.</p>
      <div className="gov-guide-sections">
        {sections.map(section => (
          <article className="gov-guide-section" key={section.title}>
            <span className="gov-service-icon">{section.icon}</span>
            <div><h2>{section.title}</h2><p>{section.text}</p></div>
          </article>
        ))}
      </div>
      <div className="gov-guide-note"><strong>Important note</strong><p>Adhikar Setu is an independent information and assistance platform, not a government authority. Scheme details can change. Verify eligibility, deadlines and application requirements through the official government department or portal.</p></div>
    </section>
  )
}
