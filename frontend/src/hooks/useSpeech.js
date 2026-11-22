import { useCallback, useEffect, useRef, useState } from 'react'

const SR = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null
export const SPEECH_LANG = { en: 'en-IN', hi: 'hi-IN', te: 'te-IN' }

/** Browser speech: recognition (voice in) and synthesis (read aloud). Support varies by browser, device and language. */
export function useSpeech(lang) {
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const recRef = useRef(null)
  const canListen = !!SR
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

  const listen = useCallback((onResult, onError) => {
    if (!SR) { onError?.('unsupported'); return }
    const rec = new SR()
    rec.lang = SPEECH_LANG[lang] || 'en-IN'
    rec.interimResults = false
    rec.maxAlternatives = 3
    rec.onresult = e => onResult([...e.results[0]].map(a => a.transcript))
    rec.onerror = e => { setListening(false); onError?.(e.error) }
    rec.onend = () => setListening(false)
    recRef.current = rec
    setListening(true)
    try { rec.start() } catch { setListening(false) }
  }, [lang])

  const stopListening = useCallback(() => { recRef.current?.stop?.(); setListening(false) }, [])

  const speak = useCallback(text => {
    if (!canSpeak || !text) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = SPEECH_LANG[lang] || 'en-IN'
    u.rate = 0.9
    u.onstart = () => setSpeaking(true)
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(u)
  }, [lang, canSpeak])

  const stopSpeaking = useCallback(() => { if (canSpeak) window.speechSynthesis.cancel(); setSpeaking(false) }, [canSpeak])

  useEffect(() => () => { if (canSpeak) window.speechSynthesis.cancel(); recRef.current?.abort?.() }, [canSpeak])

  return { listening, speaking, canListen, canSpeak, listen, stopListening, speak, stopSpeaking }
}
