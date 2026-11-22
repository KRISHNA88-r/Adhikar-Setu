import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import en from '../i18n/en.json'
import hi from '../i18n/hi.json'
import te from '../i18n/te.json'

const DICTS = { en, hi, te }
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'te', label: 'తెలుగు' }
]
const Ctx = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('adhikar_lang') || 'en')
  const [large, setLarge] = useState(() => localStorage.getItem('adhikar_large') === '1')

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.classList.toggle('large', large)
  }, [lang, large])

  const setLang = code => { localStorage.setItem('adhikar_lang', code); setLangState(code) }
  const toggleLarge = () => setLarge(v => { localStorage.setItem('adhikar_large', v ? '0' : '1'); return !v })

  const t = useCallback((key, params) => {
    let s = DICTS[lang]?.[key] ?? DICTS.en[key] ?? key
    if (params) for (const [k, v] of Object.entries(params)) s = s.replaceAll(`{${k}}`, String(v))
    return s
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t, large, toggleLarge }), [lang, t, large])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useLang = () => useContext(Ctx)
