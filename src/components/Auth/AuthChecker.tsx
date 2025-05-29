import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Assuming this context provides isAuthenticated

interface AuthCheckerProps {
  children: React.ReactNode;
}

const AuthChecker: React.FC<AuthCheckerProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;

    // If user is not authenticated
    if (!isAuthenticated) {
      // Allow access to public routes like /login and /signup
      if (pathname === '/login' || pathname === '/signup') {
        return;
      }
      // Redirect to /login for any other route if not already there
      if (pathname !== '/login') {
        navigate('/login');
      }
    } else {
      // If user is authenticated
      // Redirect from /login or /signup to home page or dashboard if not already there
      if ((pathname === '/login' || pathname === '/signup') && pathname !== '/') {
        navigate('/');
      }
    }
  }, [isAuthenticated, location, navigate]);

  return <>{children}</>;
};

export default AuthChecker;
