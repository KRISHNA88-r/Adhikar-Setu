import { useRef, useState } from 'react'
import { Camera } from 'lucide-react'
import { explainNotice } from '../api/notice'
import { useLang } from '../context/LanguageContext'
import ReadAloud from '../components/ReadAloud'

/** Shrinks a phone photo before upload so it is fast on slow networks. */
function shrink(file, maxSide = 1400) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale)
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image')) }
    img.src = url
  })
}

export default function Notice() {
  const { t, lang } = useLang()
  const fileRef = useRef(null)
  const [image, setImage] = useState(null)
  const [text, setText] = useState('')
  const [res, setRes] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const onFile = async e => {
    const f = e.target.files?.[0]; if (!f) return
    try { setImage(await shrink(f)) } catch { setError(t('ui.error')) }
  }
  const submit = async e => {
    e.preventDefault()
    if (!image && !text.trim()) return
    setBusy(true); setError(''); setRes(null)
    try { const { data } = await explainNotice({ text: text.trim() || null, imageDataUrl: image, language: lang }); setRes(data) }
    catch (err) { setError(err.response?.data?.message || t('ui.error')) }
    finally { setBusy(false) }
  }
  const field = (label, value) => value ? <div className="field"><span>{t(label)}</span><p>{value}</p></div> : null
  const spoken = res ? [res.summary, res.deadline && `${t('notice.deadline')}: ${res.deadline}`, res.action && `${t('notice.action')}: ${res.action}`].filter(Boolean).join('. ') : ''

  return <section className="page narrow"><div className="eyebrow">{t('nav.notice')}</div><h1>{t('notice.title')}</h1>
    <p className="muted">{t('notice.intro')}</p>
    <form className="panel wide" onSubmit={submit}>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={onFile} />
      <button type="button" className="button secondary big" onClick={() => fileRef.current.click()}><Camera size={20} /> {image ? t('notice.photoChosen') : t('notice.photo')}</button>
      {image && <img className="preview" src={image} alt="" />}
      <label>{t('notice.text')}<textarea rows="5" maxLength={8000} value={text} onChange={e => setText(e.target.value)} /></label>
      <button className="button big" disabled={busy || (!image && !text.trim())}>{busy ? t('notice.working') : t('notice.explain')}</button>
      <p className="muted small">{t('notice.privacy')}</p>
      {error && <p className="error">{error}</p>}
    </form>
    {res && <div className="panel wide">
      {res.message ? <p>{res.message}</p> : <>
        {res.confidence === 'low' && <p className="notice">{t('notice.lowConf')}</p>}
        {field('notice.issuer', res.issuer)}{field('notice.subject', res.subject)}{field('notice.summary', res.summary)}
        {field('notice.deadline', res.deadline)}{field('notice.action', res.action)}
        <ReadAloud text={spoken} /></>}
    </div>}
    <p className="notice">{t('ui.verifyNote')}</p>
  </section>
}
