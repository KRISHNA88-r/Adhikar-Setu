import { useLang } from '../context/LanguageContext'
export default function StatusBadge({ status }) {
  const { t } = useLang()
  return <span className={`badge badge-${status}`}>{t('badge.' + status)}</span>
}
