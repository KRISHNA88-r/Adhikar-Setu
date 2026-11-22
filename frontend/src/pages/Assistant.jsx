import { useState } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { askAssistant } from '../api/assistant'
import { useLang } from '../context/LanguageContext'
import { useSpeech } from '../hooks/useSpeech'
import ReadAloud from '../components/ReadAloud'
import { safeExternalUrl } from '../utils/formatText'

export default function Assistant() {
  const { t, lang } = useLang()
  const { listen, stopListening, listening, canListen } = useSpeech(lang)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const submit = async e => {
    e.preventDefault()
    if (!question.trim()) return
    setBusy(true); setError(''); setAnswer(null)
    try { const { data } = await askAssistant(question, lang); setAnswer(data) }
    catch (err) { setError(err.response?.data?.message || t('ui.error')) }
    finally { setBusy(false) }
  }
  return <section className="page narrow"><div className="eyebrow">{t('nav.ask')}</div><h1>{t('ask.title')}</h1>
    <p className="muted">{t('ask.intro')}</p>
    <form className="panel wide" onSubmit={submit}>
      <textarea rows="4" maxLength={3000} value={question} onChange={e => setQuestion(e.target.value)} placeholder={t('ask.placeholder')} required />
      {canListen && <button type="button" className={`mic ${listening ? 'live' : ''}`} onClick={() => listening ? stopListening() : listen(a => setQuestion(a[0]), () => {})}>
        {listening ? <MicOff size={20} /> : <Mic size={20} />} {listening ? t('check.listening') : t('ask.speak')}</button>}
      <button className="button big" disabled={busy}>{busy ? t('ask.thinking') : t('ask.button')}</button>
      {error && <p className="error">{error}</p>}
    </form>
    {answer && <div className="panel wide answer-box"><p className="pre">{answer.answer}</p><ReadAloud text={answer.answer} />
      {answer.sources?.length > 0 && <><h3>{t('ask.sources')}</h3>
        <ul className="links">{answer.sources.map(s => { const u = safeExternalUrl(s.url); return u && <li key={s.url + s.name}><a href={u} target="_blank" rel="noreferrer noopener">{s.name} ↗</a></li> })}</ul></>}
    </div>}
    <p className="notice">{t('ui.verifyNote')}</p>
  </section>
}
