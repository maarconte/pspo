import "./style.scss";
import "./style-mobile.scss";

import { Bug, LogOut, User } from "lucide-react";
import { Button_Style, Button_Type } from "../../Button/Button.types";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../Button";
import { FC } from "react";
import { HeaderProps } from "./Header.types";
import { NotificationBadge } from "../../../features/support/components/NotificationBadge/NotificationBadge";
import logo from "../../../assets/img/StudyGroup.webp";
import { useLogout } from "../../../features/auth/hooks/useLogout";
import { useUserRole } from "../../../features/auth/hooks/useUserRole";
import { useUserStore } from "../../../stores/useUserStore";

const Header: FC<HeaderProps> = () => {
  const { user } = useUserStore();
  const { isAdmin, isDev } = useUserRole();
  const navigate = useNavigate();
  const { logout } = useLogout();

  const userInitial =
    user?.displayName?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "?";

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
              {isAdmin && (
                <Link to="/admin" className="nav-link">
                  Edit questions
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin/roti" className="nav-link">
                  ROTI
                </Link>
              )}
              {isDev && (
                <Link to="/dev/users" className="nav-link">
                  Manage users
                </Link>
              )}
              <Link to="/support" className="nav-link nav-link--support">
                <Bug size={24} />
                <span>Support</span>
                <NotificationBadge />
              </Link>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
              <Button
                onClick={logout}
                icon={<LogOut size={16} />}
                type={Button_Type.ERROR}
                style={Button_Style.TONAL}
                isIconButton
              />
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
