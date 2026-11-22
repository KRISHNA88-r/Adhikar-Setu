import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
export default function Dashboard() {
  const { user } = useAuth()
  const { t } = useLang()
  const items = [['/check', 'nav.check'], ['/schemes', 'nav.schemes'], ['/scam', 'nav.scam'], ['/notice', 'nav.notice'], ['/assistant', 'nav.ask']]
  return <section className="page"><div className="eyebrow">{t('nav.dashboard')}</div><h1>{user?.name || ''}</h1>
    <div className="feature-grid">{items.map(([to, k]) => <div key={to}><strong>{t(k)}</strong><p><Link to={to}>→</Link></p></div>)}</div>
  </section>
}
