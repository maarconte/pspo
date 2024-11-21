import React, { useEffect } from "react";

import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const AuthChecker = ({ children }: Props) => {
  const navigate = useNavigate();
  console.log(auth.currentUser);
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
};

export default AuthChecker;
