import "./style.scss";
import "./style-mobile.scss";

import { FC } from "react";
import { User, LogOut, Bug } from "lucide-react";
import { NotificationBadge } from "../../../features/support/components/NotificationBadge/NotificationBadge";
import { Link, useNavigate } from "react-router-dom";

import { useUserStore } from "../../../stores/useUserStore";
import { useUserRole } from "../../../features/auth/hooks/useUserRole";
import { useLogout } from "../../../features/auth/hooks/useLogout";
import logo from "../../../assets/img/StudyGroup.webp";
import { HeaderProps } from "./Header.types";
import Button from "../../Button";
import { Button_Type, Button_Style } from "../../Button/Button.types";

const Header: FC<HeaderProps> = () => {
  const { user } = useUserStore();
  const { isAdmin, isDev } = useUserRole();
  const navigate = useNavigate();
  const { logout } = useLogout();

  const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "?";

  return (
    <header className="Header">
      <div className="header-left">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      <div className="header-right">
        {user ? (
          <div className="header-right-content">
            <nav className="header-nav">
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <Link to="/support" className="nav-link nav-link--support">
              <Bug size={16} />
              Support
              <NotificationBadge />
            </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link">
                  Edit questions
                </Link>
              )}
              {isDev && (
                <Link to="/dev/users" className="nav-link">
                  Manage users
                </Link>
              )}
              <Button onClick={logout} icon={<LogOut size={16} />} type={Button_Type.ERROR} style={Button_Style.TONAL} label="Logout" />
          </nav>
          </div>
        ) : (
          <button className="btn-login" onClick={() => navigate("/login")}>
            <User size={18} />
            <span>Login</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
