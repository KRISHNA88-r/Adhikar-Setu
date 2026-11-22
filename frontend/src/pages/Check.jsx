import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, MicOff, Volume2 } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useProfile } from '../context/ProfileContext'
import { useSpeech } from '../hooks/useSpeech'
import { checkEligibility } from '../api/schemes'
import { INCOME_RANGES } from '../utils/reasons'
import Loading from '../components/Loading'

const DIGITS = { '०': 0, '१': 1, '२': 2, '३': 3, '४': 4, '५': 5, '६': 6, '७': 7, '८': 8, '९': 9, '౦': 0, '౧': 1, '౨': 2, '౩': 3, '౪': 4, '౫': 5, '౬': 6, '౭': 7, '౮': 8, '౯': 9 }
const toAscii = s => s.replace(/[०-९౦-౯]/g, c => DIGITS[c])

function parseNumber(text) {
  const m = toAscii(text).match(/\d+(\.\d+)?/)
  if (!m) return null
  let n = parseFloat(m[0])
  if (/lakh|lac|लाख|లక్ష/i.test(text)) n *= 100000
  else if (/thousand|हज़ार|हजार|వేల|వెయ్యి/i.test(text)) n *= 1000
  return n
}
function hasWord(text, kwList) {
  const low = text.toLowerCase()
  return kwList.split('|').some(k => k && new RegExp(`(^|[^\\p{L}\\p{M}])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\p{L}\\p{M}]|$)`, 'u').test(low))
}

export default function Check() {
  const { t, lang } = useLang()
  const { saveSession } = useProfile()
  const navigate = useNavigate()
  const { listen, stopListening, listening, speak, canListen, canSpeak } = useSpeech(lang)
  const [started, setStarted] = useState(false)
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState({})
  const [pending, setPending] = useState(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [ageText, setAgeText] = useState('')

  const steps = useMemo(() => {
    const all = [
      { id: 'age', type: 'number', q: 'check.age' },
      { id: 'gender', type: 'choice', q: 'check.gender', opts: ['MALE', 'FEMALE', 'OTHER'], label: o => t('opt.' + o), kw: o => t(o === 'OTHER' ? 'kw.other' : 'kw.' + o) },
      { id: 'area', type: 'choice', q: 'check.area', opts: ['RURAL', 'URBAN'], label: o => t('opt.' + o), kw: o => t('kw.' + o) },
      { id: 'occupation', type: 'choice', q: 'check.occupation', opts: ['farmer', 'student', 'worker', 'vendor', 'artisan', 'business', 'homemaker', 'other'], label: o => t('occ.' + o), kw: o => t('kw.' + o) },
      { id: 'ownsLand', type: 'choice', q: 'check.land', opts: ['true', 'false'], label: o => t(o === 'true' ? 'ui.yes' : 'ui.no'), kw: o => t(o === 'true' ? 'kw.yes' : 'kw.no'), onlyIf: a => a.occupation === 'farmer' },
      { id: 'income', type: 'income', q: 'check.income', opts: INCOME_RANGES.map(r => r.id), label: o => t('inc.' + o) },
      { id: 'hasDisability', type: 'choice', q: 'check.disability', opts: ['true', 'false'], label: o => t(o === 'true' ? 'ui.yes' : 'ui.no'), kw: o => t(o === 'true' ? 'kw.yes' : 'kw.no') }
    ]
    return all.filter(s => !s.onlyIf || s.onlyIf(answers))
  }, [t, answers])

  const step = steps[i]
  const total = steps.length

  useEffect(() => { if (started && step && canSpeak) speak(t(step.q)) }, [started, i, lang]) // eslint-disable-line

  const finish = async final => {
    setBusy(true); setError('')
    const range = INCOME_RANGES.find(r => r.id === final.income)
    const profile = {
      age: final.age ?? null, gender: final.gender ?? null, area: final.area ?? null, occupation: final.occupation ?? null,
      ownsLand: final.ownsLand === undefined ? null : final.ownsLand === 'true',
      hasDisability: final.hasDisability === undefined ? null : final.hasDisability === 'true',
      incomeMin: range ? range.min : null, incomeMax: range ? range.max : null
    }
    try {
      const { data } = await checkEligibility(profile)
      saveSession(profile, final, data.results)
      navigate('/results')
    } catch (err) { setError(err.response?.data?.message || t('ui.error')); setBusy(false) }
  }

  const accept = value => {
    const next = { ...answers }
    if (value === undefined) delete next[step.id]; else next[step.id] = value
    setAnswers(next); setPending(null); setMsg(''); setAgeText('')
    // recompute remaining steps with the new answers (land question depends on occupation)
    const remaining = steps.filter(s => !s.onlyIf || s.onlyIf(next))
    const idx = remaining.findIndex(s => s.id === step.id)
    if (idx + 1 >= remaining.length) finish(next); else setI(idx + 1)
  }

  const fromVoice = alts => {
    for (const text of alts) {
      let value, label
      if (step.type === 'number') {
        const n = parseNumber(text)
        if (n && n > 0 && n < 121) { value = Math.round(n); label = String(value) }
      } else if (step.type === 'income') {
        const n = parseNumber(text)
        if (n) {
          const rupees = n <= 20 && !/lakh|लाख|లక్ష|thousand|हज़ार|हजार|వేల|వెయ్యి/i.test(text) ? n * 100000 : n
          const r = INCOME_RANGES.find(r => rupees >= r.min && (r.max === null || rupees < r.max))
          if (r) { value = r.id; label = t('inc.' + r.id) }
        }
      } else {
        const hit = step.opts.find(o => hasWord(text, step.kw(o)))
        if (hit) { value = hit; label = step.label(hit) }
      }
      if (value !== undefined) { setPending({ value, label }); const m = t('check.heard', { answer: label }); setMsg(m); if (canSpeak) speak(m); return }
    }
    setMsg(t('check.notHeard'))
  }
  const onMic = () => { setMsg(''); listening ? stopListening() : listen(fromVoice, () => setMsg(t('check.notHeard'))) }

  if (busy) return <section className="page narrow"><Loading /></section>

  if (!started) return <section className="page narrow">
    <div className="eyebrow">{t('nav.check')}</div><h1>{t('check.consent.title')}</h1>
    <p className="muted">{t('check.intro')}</p>
    <div className="panel wide"><p>{t('check.consent.body')}</p>
      <button className="button big" onClick={() => setStarted(true)}>{t('check.consent.ok')}</button></div>
  </section>

  return <section className="page narrow">
    <div className="eyebrow">{t('check.step', { n: i + 1, total })}</div>
    <div className="progress"><span style={{ width: `${((i + 1) / total) * 100}%` }} /></div>
    <h1 className="q">{t(step.q)} {canSpeak && <button type="button" className="icon-btn" onClick={() => speak(t(step.q))} aria-label={t('ui.listen')}><Volume2 size={22} /></button>}</h1>

    {step.type === 'number' ? <div className="panel wide">
      <label>{t('check.age.hint')}<input type="number" inputMode="numeric" min="0" max="120" value={ageText} onChange={e => setAgeText(e.target.value)} /></label>
      <button className="button big" disabled={!ageText || +ageText < 0 || +ageText > 120} onClick={() => accept(Math.round(+ageText))}>{t('ui.next')}</button>
    </div> : <div className="choices">
      {step.opts.map(o => <button key={o} className="choice" onClick={() => accept(o)}>{step.label(o)}</button>)}
    </div>}

    {pending ? <div className="panel wide confirm"><p>{msg}</p>
      <div className="actions"><button className="button" onClick={() => accept(pending.value)}>{t('ui.yes')}</button>
        <button className="button secondary" onClick={() => { setPending(null); setMsg('') }}>{t('ui.no')}</button></div></div>
      : <div className="voice-row">
        {canListen ? <button className={`mic ${listening ? 'live' : ''}`} onClick={onMic}>{listening ? <MicOff size={22} /> : <Mic size={22} />} {listening ? t('check.listening') : t('check.speak')}</button>
          : <p className="muted">{t('check.noVoice')}</p>}
        {msg && <p className="muted">{msg}</p>}
      </div>}

    <div className="nav-row">
      <button className="button secondary" disabled={i === 0} onClick={() => setI(i - 1)}>{t('ui.back')}</button>
      <button className="button secondary" onClick={() => accept(undefined)}>{t('ui.dontKnow')}</button>
    </div>
    {error && <p className="error">{error}</p>}
  </section>
}
