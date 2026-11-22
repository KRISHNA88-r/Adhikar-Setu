import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Printer, ExternalLink } from 'lucide-react'
import { getScheme } from '../api/schemes'
import { useLang } from '../context/LanguageContext'
import { useProfile } from '../context/ProfileContext'
import StatusBadge from '../components/StatusBadge'
import ReasonList from '../components/ReasonList'
import ReadAloud from '../components/ReadAloud'
import Loading from '../components/Loading'
import { safeExternalUrl } from '../utils/formatText'
import { INCOME_RANGES } from '../utils/reasons'

export default function SchemeDetail() {
  const { slug } = useParams()
  const { t } = useLang()
  const { results, profile, answers } = useProfile()
  const [s, setS] = useState(null)
  const [error, setError] = useState('')
  const [done, setDone] = useState({})
  useEffect(() => { getScheme(slug).then(({ data }) => setS(data)).catch(() => setError(t('ui.error'))) }, [slug]) // eslint-disable-line

  if (error) return <section className="page"><p className="error">{error}</p></section>
  if (!s) return <section className="page"><Loading /></section>

  const mine = results?.find(r => r.scheme.slug === s.slug)
  const docs = (s.documents || '').split(',').map(x => x.trim()).filter(Boolean)
  const url = safeExternalUrl(s.officialUrl)
  const incomeLabel = answers?.income ? t('inc.' + answers.income) : null
  const spoken = `${s.name}. ${s.benefit}. ${t('scheme.how')}: ${s.howToApply}`

  return <section className="page narrow detail">
    <Link className="back no-print" to={mine ? '/results' : '/schemes'}>← {t('scheme.back')}</Link>
    <div className="eyebrow">{s.category}</div>
    <h1>{s.name}</h1>
    {mine && <div className="no-print"><StatusBadge status={mine.status} /><ReasonList reasons={mine.reasons} /></div>}
    <div className="no-print"><ReadAloud text={spoken} /></div>

    <h2>{t('scheme.benefit')}</h2><p>{s.benefit}</p>
    <h2>{t('scheme.who')}</h2><p>{s.eligibility}</p>
    {s.rulesNote && <p className="muted small"><b>{t('scheme.note')}:</b> {s.rulesNote}</p>}
    <h2>{t('scheme.how')}</h2><p>{s.howToApply}</p>
    <h2>{t('scheme.deadline')}</h2><p>{s.deadline || '—'}</p>

    <h2>{t('scheme.docs')}</h2>
    <p className="muted small no-print">{t('scheme.docsHint')}</p>
    <ul className="checklist">{docs.map((d, i) => <li key={i}>
      <label><input type="checkbox" checked={!!done[i]} onChange={() => setDone({ ...done, [i]: !done[i] })} /> <span className={done[i] ? 'struck' : ''}>{d}</span></label></li>)}</ul>

    {(profile || incomeLabel) && <div className="print-only packet-details">
      <h2>{t('scheme.yourDetails')}</h2>
      <ul>
        {profile?.age != null && <li>{t('profile.age')}: {profile.age}</li>}
        {profile?.gender && <li>{t('profile.gender')}: {t('opt.' + profile.gender)}</li>}
        {profile?.area && <li>{t('profile.area')}: {t('opt.' + profile.area)}</li>}
        {profile?.occupation && <li>{t('profile.occupation')}: {t('occ.' + profile.occupation)}</li>}
        {incomeLabel && <li>{t('profile.income')}: {incomeLabel}</li>}
      </ul></div>}
    <p className="print-only small">{t('scheme.generated')}: {new Date().toLocaleDateString()} · {url}</p>
    <p className="notice">{t('scheme.unverified')}</p>

    <div className="actions no-print">
      {url && <a className="button" href={url} target="_blank" rel="noreferrer noopener"><ExternalLink size={16} /> {t('ui.officialSite')}</a>}
      <button className="button secondary" onClick={() => window.print()}><Printer size={16} /> {t('scheme.print')}</button>
    </div>
  </section>
}
