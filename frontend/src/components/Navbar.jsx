
import { Link, NavLink } from 'react-router-dom'
import { Landmark, BookOpen, LogIn, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { LANGUAGES, useLang } from '../context/LanguageContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { lang, setLang, t, large, toggleLarge } = useLang()

  return (
    <>
      <div className="gov-topbar">
        <span>ADHIKAR SETU | CITIZEN INFORMATION AND ASSISTANCE</span>
        <span>Independent public-service information platform</span>
      </div>
      <header className="navbar gov-navbar">
        <Link className="brand gov-brand" to="/">
          <span className="gov-brand-icon"><Landmark size={27} /></span>
          <span>Adhikar Setu<small>Citizen Services Portal</small></span>
        </Link>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/check">{t('nav.check')}</NavLink>
          <NavLink to="/schemes">{t('nav.schemes')}</NavLink>
          <NavLink to="/scam">{t('nav.scam')}</NavLink>
          <NavLink to="/notice">{t('nav.notice')}</NavLink>
          <NavLink to="/assistant">{t('nav.ask')}</NavLink>
          {user && <NavLink to="/guide"><BookOpen size={15} /> User Guide</NavLink>}
        </nav>
        <div className="nav-tools gov-nav-tools">
          <div className="lang-switch" role="group" aria-label="Language">
            {LANGUAGES.map(l => (
              <button key={l.code} className={l.code === lang ? 'on' : ''} onClick={() => setLang(l.code)} lang={l.code}>{l.label}</button>
            ))}
          </div>
          <button className={`size-toggle ${large ? 'on' : ''}`} onClick={toggleLarge} aria-pressed={large}>A+ <span>{t('nav.largeText')}</span></button>
          {user ? (
            <>
              <NavLink to="/dashboard">{t('nav.dashboard')}</NavLink>
              <button className="nav-button" onClick={logout}><LogOut size={15} /> {t('nav.logout')}</button>
            </>
          ) : <NavLink className="gov-login-link" to="/login"><LogIn size={16} /> {t('nav.login')}</NavLink>}
        </div>
      </header>
    </>
  )
}
