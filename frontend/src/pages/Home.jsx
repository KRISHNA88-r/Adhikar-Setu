
import { Link } from 'react-router-dom'
import { Mic, FileText, ShieldAlert, ShieldCheck, ListChecks, Languages, BookOpen, ArrowRight, Landmark } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { t } = useLang()
  const { user } = useAuth()

  const services = [
    { to: '/check', icon: <Mic />, title: t('home.route1.t'), description: t('home.route1.d') },
    { to: '/schemes', icon: <Landmark />, title: 'Government Schemes', description: 'Explore available welfare schemes and their benefits.' },
    { to: '/notice', icon: <FileText />, title: t('home.route2.t'), description: t('home.route2.d') },
    { to: '/scam', icon: <ShieldAlert />, title: t('home.route3.t'), description: t('home.route3.d') },
    { to: '/assistant', icon: <BookOpen />, title: 'Adhikar Setu Assistant', description: 'Ask questions about schemes and services on this website.' }
  ]

  return (
    <div className="gov-home">
      <section className="gov-welcome">
        <div className="gov-welcome-content">
          <div className="gov-kicker"><Landmark size={17} /> CITIZEN SERVICES PORTAL</div>
          <h1>{t('home.title1')} <span>{t('home.title2')}</span></h1>
          <p>{t('home.sub')}</p>
          <div className="gov-actions">
            <Link className="gov-primary-button" to="/check"><Mic size={18} /> Check Eligibility</Link>
            <Link className="gov-secondary-button" to="/schemes">Explore Schemes <ArrowRight size={17} /></Link>
          </div>
          {user && <div className="gov-signed-in">Welcome back, {user.name || 'Citizen'}. You are signed in.</div>}
        </div>
        <div className="gov-welcome-side">
          <div className="gov-side-icon"><Landmark size={54} /></div>
          <strong>Information. Awareness. Assistance.</strong>
          <p>One platform to explore public welfare information and citizen-support services.</p>
        </div>
      </section>

      <section className="gov-section">
        <div className="gov-section-heading">
          <div><span className="gov-section-label">OUR SERVICES</span><h2>Citizen Services</h2></div>
          <p>Access the tools and information available on Adhikar Setu.</p>
        </div>
        <div className="gov-service-grid">
          {services.map((service, index) => (
            <Link to={service.to} className="gov-service-card" key={service.to}>
              <span className="gov-service-number">0{index + 1}</span>
              <span className="gov-service-icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="gov-card-link">Open service <ArrowRight size={16} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="gov-information">
        <div>
          <span className="gov-section-label">HOW IT WORKS</span>
          <h2>Access information in three simple steps</h2>
        </div>
        <div className="gov-steps">
          <div><span>01</span><Languages /><strong>Choose a service</strong><p>Select the service or information you need.</p></div>
          <div><span>02</span><ListChecks /><strong>Provide details</strong><p>Enter the required information in the relevant tool.</p></div>
          <div><span>03</span><ShieldCheck /><strong>Review guidance</strong><p>Read the result and verify important details with official sources.</p></div>
        </div>
      </section>

      {user && (
        <section className="gov-guide-banner">
          <BookOpen size={30} />
          <div><strong>New to Adhikar Setu?</strong><p>Read the user guide to understand the services and how to use this platform.</p></div>
          <Link to="/guide">Read User Guide <ArrowRight size={17} /></Link>
        </section>
      )}

      <p className="gov-disclaimer">{t('home.sample')} Adhikar Setu is an independent citizen-assistance platform and is not an official government website. Always verify scheme details on the relevant official government portal.</p>
    </div>
  )
}
