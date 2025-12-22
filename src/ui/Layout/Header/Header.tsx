import "./style.scss";
import "./style-mobile.scss";

import React, { FC } from "react";
import { User } from "lucide-react";

import Button from "../../../ui/Button/Button";
import { Button_Style } from "../../../ui/Button/Button.types";
import { HeaderProps } from "./Header.types";
import { Link } from "react-router-dom";
import Logout from "../../../features/auth/components/Auth/Logout";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../stores/useUserStore";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Header: FC<HeaderProps> = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  return (
    <div className="Header flex h-16 shrink-0 items-center gap-2 border-b px-4">
      {user && <SidebarTrigger className="ml-1" />}
      <h1 className="h4">
        <Link to="/">Agile.training</Link>
      </h1>
      <div className="d-flex gap-1 align-items-center">
        {!user && (
          <Button
            label="Login"
            style={Button_Style.OUTLINED}
            icon={<User size={16} />}
            onClick={() => navigate("/login")}
          />
        )}
        {user && <Logout />}
      </div>
    </div>
  );
};

export default Header;
