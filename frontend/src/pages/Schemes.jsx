import { useEffect, useMemo, useState } from 'react'
import { getSchemes } from '../api/schemes'
import SchemeCard from '../components/SchemeCard'
import Loading from '../components/Loading'
import { useLang } from '../context/LanguageContext'

export default function Schemes() {
  const { t } = useLang()
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  useEffect(() => {
    getSchemes().then(({ data }) => setSchemes(data)).catch(() => setError(t('ui.error'))).finally(() => setLoading(false))
  }, []) // eslint-disable-line
  const cats = useMemo(() => [...new Set(schemes.map(s => s.category))], [schemes])
  const shown = schemes.filter(s => (!cat || s.category === cat) && (!q || `${s.name} ${s.description} ${s.benefit}`.toLowerCase().includes(q.toLowerCase())))
  return <section className="page"><div className="eyebrow">{t('nav.schemes')}</div><h1>{t('scheme.title')}</h1>
    <p className="muted">{t('scheme.sub')}</p>
    <input className="search" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder={t('scheme.search')} aria-label={t('scheme.search')} />
    <div className="chips"><button className={!cat ? 'on' : ''} onClick={() => setCat('')}>{t('scheme.all')}</button>
      {cats.map(c => <button key={c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{c}</button>)}</div>
    {loading ? <Loading /> : error ? <p className="error">{error}</p> : shown.length === 0 ? <p className="muted">{t('scheme.none')}</p> :
      <div className="scheme-grid">{shown.map(s => <SchemeCard key={s.id} scheme={s} />)}</div>}
  </section>
}
