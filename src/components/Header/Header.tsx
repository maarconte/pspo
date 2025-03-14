import "./style.scss";
import "./style-mobile.scss";

import React, { FC, useContext } from "react";

import Button from "../Button";
import { Button_Style } from "../Button/Button.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HeaderProps } from "./Header.types";
import { Link } from "react-router-dom";
import Logout from "../Auth/Logout";
import { UserContext } from "../../utils/context/UserContext";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Header: FC<HeaderProps> = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <div className="Header">
      <h1 className="h4">
        <Link to="/">PSPO</Link>
      </h1>
      <div className="d-flex gap-1 align-items-center">
        <Button
          label="Admin"
          style={Button_Style.OUTLINED}
          icon={<FontAwesomeIcon icon={faGear} />}
          onClick={() => navigate(!user ? "/login" : "/admin")}
        />
        {user && <Logout />}
      </div>
    </div>
  );
};

export default Header;
