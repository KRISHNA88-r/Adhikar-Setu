import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
export default function SchemeCard({ scheme }) {
  const { t } = useLang()
  return <article className="scheme-card">
    <span className="eyebrow">{scheme.category || 'Government scheme'}</span>
    <h3>{scheme.name}</h3>
    <p>{scheme.benefit || scheme.description}</p>
    <Link to={`/schemes/${scheme.slug || scheme.id}`}>{t('results.details')} →</Link>
  </article>
}
