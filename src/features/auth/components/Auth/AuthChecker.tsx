import { ReactNode, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/useAuthStore";

interface AuthCheckerProps {
  children: ReactNode;
}

/**
 * AuthChecker - Vérifie l'authentification de l'utilisateur
 * Optimisé pour ne vérifier qu'une seule fois au montage initial
 * au lieu de se déclencher à chaque changement de page
 */
const AuthChecker = ({ children }: AuthCheckerProps) => {
  const navigate = useNavigate();
  // Utilisation d'un sélecteur Zustand propre
  const user = useUserStore((s) => s.user);
  // Ref pour éviter les vérifications multiples
  const hasChecked = useRef(false);

  useEffect(() => {
    // Ne vérifier qu'une seule fois au montage initial
    if (hasChecked.current) return;

    hasChecked.current = true;

    if (!user) {
      console.log('AuthChecker: No user found, redirecting to /');
      navigate("/", { replace: true });
    } else {
      console.log('AuthChecker: User authenticated:', user.email);
    }
  }, []); // Dépendances vides = exécution uniquement au montage

  // Si pas d'utilisateur, ne rien afficher (la redirection va se faire)
  if (!user) {
    return null;
  }

  // Afficher les enfants si l'utilisateur est authentifié
  return <>{children}</>;
};

export default AuthChecker;

