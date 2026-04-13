import { useEffect, useRef } from 'react';
import './Footer.scss';
import logo from '../../../assets/img/StudyGroup.webp';

// Declare PayPal global for TypeScript
declare global {
  interface Window {
    PayPal?: {
      Donation: {
        Button: (config: any) => {
          render: (selector: string) => void;
        };
      };
    };
  }
}

const Footer = () => {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations in dev mode / strict mode
    if (isInitialized.current) return;

    const initPayPal = () => {
      if (window.PayPal) {
        window.PayPal.Donation.Button({
          env: 'production',
          hosted_button_id: 'QZCENBKK9TN6E',
          image: {
            src: 'https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif',
            alt: 'Donate with PayPal button',
            title: 'PayPal - The safer, easier way to pay online!',
          }
        }).render('#donate-button');
        isInitialized.current = true;
      }
    };

    // Load SDK if not present
    if (!document.getElementById('paypal-donate-sdk')) {
      const script = document.createElement('script');
      script.id = 'paypal-donate-sdk';
      script.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
      script.charset = 'UTF-8';
      script.async = true;
      script.onload = initPayPal;
      document.body.appendChild(script);
    } else {
      initPayPal();
    }
  }, []);

  return (
    <footer className="Footer">
      <div className="footer-container">
        <div className="footer-section">
          <img src={logo} alt="Logo" className='logo' />
          <p>Préparez votre certification Agile avec confiance.</p>
        </div>

        <div className="footer-section donation">
          <p>Soutenez le projet</p>
          <div id="donate-button-container">
            <div id="donate-button"></div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Study Group. Fait avec passion pour la communauté Agile.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
