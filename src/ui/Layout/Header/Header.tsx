import "./style.scss";
import "./style-mobile.scss";

import React, { FC } from "react";
import { Settings } from "lucide-react";

import Button from "../../../ui/Button/Button";
import { Button_Style } from "../../../ui/Button/Button.types";
import { HeaderProps } from "./Header.types";
import { Link } from "react-router-dom";
import Logout from "../../../features/auth/components/Auth/Logout";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../stores/useUserStore";

const Header: FC<HeaderProps> = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  return (
    <div className="Header">
      <h1 className="h4">
        <Link to="/">Agile.training</Link>
      </h1>
      <div className="d-flex gap-1 align-items-center">
        <Button
          label="Admin"
          style={Button_Style.OUTLINED}
          icon={<Settings size={16} />}
          onClick={() => navigate(!user ? "/login" : "/admin")}
        />
        {user && <Logout />}
      </div>
    </div>
  );
};

export default Header;
