import { ReactNode, useEffect } from "react";

import { useUserStore } from "../../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const AuthChecker = ({ children }: Props) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const isAuthLoading = useUserStore((state) => state.isAuthLoading);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/");
    }
  }, [user, isAuthLoading, navigate]);

  if (isAuthLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
};

export default AuthChecker;

