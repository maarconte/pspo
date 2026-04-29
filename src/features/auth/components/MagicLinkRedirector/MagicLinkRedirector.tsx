import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';

export const MagicLinkRedirector = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isMagicLink()) {
      sessionStorage.setItem('magicLinkOriginalUrl', window.location.href);
      navigate('/auth/verify');
    }
  }, [navigate]);

  return null;
};
