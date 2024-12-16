import React, { useContext, useEffect } from "react";

import { UserContext } from "../../utils/context/UserContext";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const AuthChecker = ({ children }: Props) => {
  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate("/");
    }
  });
  return <>{children}</>;
};

export default AuthChecker;
