import { Link, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useProfile } from '../context/ProfileContext'
import StatusBadge from '../components/StatusBadge'
import ReasonList from '../components/ReasonList'
import ReadAloud from '../components/ReadAloud'
import { inr } from '../utils/reasons'

export default function Results() {
  const { t } = useLang()
  const { results, clearSession } = useProfile()
  const [deleted, setDeleted] = useState(false)

  if (deleted) return <section className="page narrow"><p className="answer">{t('results.deleted')}</p><Link className="button" to="/check">{t('results.again')}</Link></section>
  if (!results) return <Navigate to="/check" replace />

  const by = s => results.filter(r => r.status === s)
  const eligible = by('ELIGIBLE'), almost = by('ALMOST'), not = by('NOT_ELIGIBLE')
  const value = eligible.reduce((sum, r) => sum + (r.scheme.annualValue || 0), 0)
  const line = t('results.summaryLine', { e: eligible.length, a: almost.length, n: not.length })

  const Card = ({ r }) => <article className="scheme-card result">
    <div className="card-head"><StatusBadge status={r.status} /><span className="eyebrow">{r.scheme.category}</span></div>
    <h3>{r.scheme.name}</h3>
    <p>{r.scheme.benefit}</p>
    <ReasonList reasons={r.reasons} />
    <Link className="button small" to={`/schemes/${r.scheme.slug}`}>{t('results.details')} →</Link>
  </article>

  const Group = ({ title, items, open }) => <section className="block">
    <h2>{title} <span className="count">{items.length}</span></h2>
    {items.length === 0 ? <p className="muted">{t('results.none')}</p>
      : open ? <div className="scheme-grid">{items.map(r => <Card key={r.scheme.slug} r={r} />)}</div>
        : <details><summary>{t('results.details')}</summary><div className="scheme-grid">{items.map(r => <Card key={r.scheme.slug} r={r} />)}</div></details>}
  </section>

  return <section className="page">
    <div className="eyebrow">{t('nav.check')}</div><h1>{t('results.title')}</h1>
    <p className="muted">{t('results.sub')}</p>
    <div className="summary panel wide"><strong>{line}</strong> <ReadAloud text={line} />
      {value > 0 && <div className="value"><span>{t('results.value')}</span><b>₹{inr(value)}</b><small>{t('results.valueNote')}</small></div>}</div>
    <Group title={t('results.eligible')} items={eligible} open />
    <Group title={t('results.almost')} items={almost} open />
    <Group title={t('results.not')} items={not} />
    <p className="notice">{t('ui.verifyNote')}</p>
    <div className="actions"><Link className="button secondary" to="/check">{t('results.again')}</Link>
      <button className="button secondary" onClick={() => { clearSession(); setDeleted(true) }}>{t('results.delete')}</button></div>
  </section>
}
