import { Volume2, Square } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useSpeech } from '../hooks/useSpeech'

export default function ReadAloud({ text, className = '' }) {
  const { lang, t } = useLang()
  const { speak, stopSpeaking, speaking, canSpeak } = useSpeech(lang)
  if (!canSpeak || !text) return null
  return <button type="button" className={`listen-btn ${className}`} onClick={() => (speaking ? stopSpeaking() : speak(text))}
    aria-label={speaking ? t('ui.stop') : t('ui.listen')}>
    {speaking ? <Square size={16} /> : <Volume2 size={16} />}<span>{speaking ? t('ui.stop') : t('ui.listen')}</span>
  </button>
}
