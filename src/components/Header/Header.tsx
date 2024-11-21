import "./style.scss";
import "./style-mobile.scss";

import React, { FC } from "react";

import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HeaderProps } from "./Header.types";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Header: FC<HeaderProps> = () => {
  const navigate = useNavigate();
  return (
    <div className="Header">
      <h1 className="h4">PSPO</h1>
      <Button
        label="Log in"
        icon={<FontAwesomeIcon icon={faUser} />}
        onClick={() => navigate("/login")}
      />
    </div>
  );
};

export default Header;
