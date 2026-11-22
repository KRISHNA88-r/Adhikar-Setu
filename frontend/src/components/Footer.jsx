
import { Link } from 'react-router-dom'
import { Landmark } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="footer gov-footer">
      <div className="gov-footer-main">
        <div className="gov-footer-brand">
          <Landmark size={30} />
          <div><strong>Adhikar Setu</strong><span>Citizen Services Portal</span></div>
        </div>
        <p>A digital platform providing information and assistance related to public welfare schemes and citizen services.</p>
      </div>
      <div className="gov-footer-links">
        <strong>Important Links</strong>
        <Link to="/">Home</Link>
        <Link to="/schemes">Government Schemes</Link>
        <Link to="/assistant">Adhikar Setu Assistant</Link>
        <Link to="/privacy">{t('footer.privacy')}</Link>
      </div>
      <div className="gov-footer-bottom">
        <span>© {new Date().getFullYear()} Adhikar Setu</span>
        <span>Independent citizen-assistance platform. Not an official government website.</span>
      </div>
    </footer>
  )
}
