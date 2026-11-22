import { Check, X, HelpCircle } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { renderReason } from '../utils/reasons'

export default function ReasonList({ reasons }) {
  const { t } = useLang()
  const icon = { ok: <Check size={16} />, fail: <X size={16} />, unknown: <HelpCircle size={16} /> }
  return <ul className="reasons">{reasons.map((r, i) =>
    <li key={i} className={`reason reason-${r.state}`}><span className="reason-icon">{icon[r.state]}</span>{renderReason(r, t)}</li>)}</ul>
}
