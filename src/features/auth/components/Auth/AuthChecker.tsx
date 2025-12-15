import { ReactNode, useEffect } from "react";

import { useUserStore } from "../../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const AuthChecker = ({ children }: Props) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return <>{children}</>;
};

export default AuthChecker;

