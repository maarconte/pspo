import "./style.scss";
import "./style-mobile.scss";

import React, { FC } from "react";
import { Dropdown } from "rsuite";
import { ChevronDown, Settings, User, Users, LogOut, BarChart2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useUserStore } from "../../../stores/useUserStore";
import { useUserRole } from "../../../features/auth/hooks/useUserRole";
import { useLogout } from "../../../features/auth/hooks/useLogout";
import logo from "../../../assets/img/StudyGroup.webp";
import { HeaderProps } from "./Header.types";

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

        {user && (
          <nav className="header-nav">
            <Link to="/profile" className="nav-link">
              Statistiques
            </Link>

            {isAdmin && (
              <Dropdown
                title={
                  <span className="nav-dropdown-toggle">
                    Admin <ChevronDown size={14} />
                  </span>
                }
                noCaret
                className="nav-dropdown"
              >
                {isDev && (
                  <Dropdown.Item onClick={() => navigate("/dev/users")} icon={<Users size={16} />}>
                    Users
                  </Dropdown.Item>
                )}
                {isAdmin && (
                  <Dropdown.Item onClick={() => navigate("/admin")} icon={<Settings size={16} />}>
                    Edit questions
                  </Dropdown.Item>
                )}
              </Dropdown>
            )}
          </nav>
        )}
      </div>

      <div className="header-right">
        {user ? (
          <Dropdown
            title={
              <div className="user-profile-toggle">
                <div className="user-avatar-small">{userInitial}</div>
                <span className="user-email">{user.email}</span>
                <ChevronDown size={14} className="ms-1" />
              </div>
            }
            noCaret
            placement="bottomEnd"
            className="user-dropdown"
          >
            <Dropdown.Item onClick={() => navigate("/profile")} icon={<User size={16} />}>
              Mon Compte
            </Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item onClick={logout} icon={<LogOut size={16} />} className="text-danger">
              Logout
            </Dropdown.Item>
          </Dropdown>
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
