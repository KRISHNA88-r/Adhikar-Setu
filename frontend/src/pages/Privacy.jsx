import { useLang } from '../context/LanguageContext'
export default function Privacy() {
  const { t } = useLang()
  return <section className="page narrow"><div className="eyebrow">{t('footer.privacy')}</div><h1>{t('footer.privacy')}</h1>
    <ul className="plain">
      {[1, 3, 4].map(n => <li key={n}>{t('home.trust' + n)}</li>)}
      <li>{t('notice.privacy')}</li>
    </ul>
    <p>{t('check.consent.body')}</p>
    <p className="notice">{t('ui.verifyNote')}</p>
  </section>
}
