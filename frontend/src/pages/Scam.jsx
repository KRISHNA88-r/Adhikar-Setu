import { useState } from 'react'
import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react'
import { checkScam } from '../api/scam'
import { useLang } from '../context/LanguageContext'
import { renderScamReason } from '../utils/reasons'
import ReadAloud from '../components/ReadAloud'

export default function Scam() {
  const { t } = useLang()
  const [text, setText] = useState('')
  const [res, setRes] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const submit = async e => {
    e.preventDefault(); if (!text.trim()) return
    setBusy(true); setError(''); setRes(null)
    try { const { data } = await checkScam(text); setRes(data) }
    catch (err) { setError(err.response?.data?.message || t('ui.error')) }
    finally { setBusy(false) }
  }
  const Icon = res?.level === 'HIGH' ? ShieldAlert : res?.level === 'MEDIUM' ? ShieldQuestion : ShieldCheck
  return <section className="page narrow"><div className="eyebrow">{t('nav.scam')}</div><h1>{t('scam.title')}</h1>
    <p className="muted">{t('scam.intro')}</p>
    <form className="panel wide" onSubmit={submit}>
      <textarea rows="6" value={text} maxLength={5000} onChange={e => setText(e.target.value)} placeholder={t('scam.placeholder')} required />
      <button className="button big" disabled={busy}>{busy ? t('scam.checking') : t('scam.check')}</button>
      {error && <p className="error">{error}</p>}
    </form>
    {res && <div className={`panel wide scam-result level-${res.level}`}>
      <h2><Icon size={26} /> {t('scam.level.' + res.level)}</h2>
      <p>{t('scam.advice.' + res.level)}</p>
      <ReadAloud text={`${t('scam.level.' + res.level)}. ${t('scam.advice.' + res.level)}`} />
      <h3>{t('scam.reasons')}</h3>
      <ul className="reasons">{res.reasons.map((r, i) => <li key={i} className={`reason reason-${r.state === 'warn' ? 'fail' : 'ok'}`}>{renderScamReason(r, t)}</li>)}</ul>
      {res.links.length > 0 && <><h3>{t('scam.links')}</h3>
        <ul className="links">{res.links.map((l, i) => <li key={i}><code>{l.url}</code> <span className={l.official ? 'tag ok' : 'tag warn'}>{l.official ? t('scam.official') : t('scam.notOfficial')}</span></li>)}</ul></>}
    </div>}
    <p className="notice">{t('ui.verifyNote')}</p>
  </section>
}
