import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';

export const MagicLinkRedirector = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isMagicLink()) {
      console.log('🔗 Magic Link detected on root, redirecting to verification page...');
      // Preserve the query parameters which contain the auth code
      navigate('/auth/verify' + window.location.search);
    }
  }, [navigate]);

  return null;
};
