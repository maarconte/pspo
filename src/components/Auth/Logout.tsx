import React, { useState } from "react";

import Button from "../Button";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface Props {
  navigateTo?: string;
}

const Logout = ({ navigateTo = "/" }: Props) => {
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const logout = () => {
    setDisabled(true);
    signOut(auth)
      .then(() => {
        navigate(navigateTo);
      })
      .catch((error) => {
        setDisabled(false);
      });
  };

  return (
    <div>
      <Button disabled={disabled} onClick={logout} label="Logout" />
    </div>
  );
};

export default Logout;
