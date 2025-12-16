import { ReactNode, useEffect, useState } from "react";

import { useUserStore } from "../../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const AuthChecker = ({ children }: Props) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Attendre un peu pour que l'auth se charge
    const timer = setTimeout(() => {
      setIsChecking(false);
      if (!user) {
        console.log('AuthChecker: No user found, redirecting to /');
        navigate("/");
      } else {
        console.log('AuthChecker: User authenticated:', user.email);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  if (isChecking) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default AuthChecker;

