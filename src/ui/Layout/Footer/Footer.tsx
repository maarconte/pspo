import './Footer.scss';
import logo from '../../../assets/img/StudyGroup.webp';
import Button from '../../Button';
import { Heart } from 'lucide-react';
import { Button_Style, Button_Type } from '../../Button/Button.types';
import { Link } from 'react-router-dom';

const Footer = () => {

  return (
    <footer className="Footer">
      <div className="footer-container">
        <div className="footer-section">
          <img src={logo} alt="Logo" className='logo' />
          <p>Préparez votre certification Agile avec confiance.</p>
        </div>
        <div className="footer-section">
          <h4 className='mb-1'>Liens utiles</h4>
          <ul className='footer-nav'>
            <li>
              <Link to="https://www.scrum.org/" target="_blank">Certification (Scrum.org)</Link>
            </li>
            <li>
              <Link to="https://www.scrum.org/open-assessments" target="_blank">Open Assessments (Scrum.org)</Link>
            </li>
            <li>
              <Link to="https://scrumguides.org/download.html" target="_blank">Scrum Guide</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section donation">
          <p>Soutenez le projet</p>
            <Button
                url="https://www.paypal.com/donate/?hosted_button_id=QZCENBKK9TN6E"
                icon={<Heart size={16} />}
                type={Button_Type.WARNING}
                style={Button_Style.TONAL}
                label="Donate"
              />
        </div>

        <div className="footer-bottom">
          <p>{new Date().getFullYear()} Study Group. Fait avec passion pour la communauté Agile.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
