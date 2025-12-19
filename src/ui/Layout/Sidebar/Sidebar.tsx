import "./style.scss";

import { FC, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Settings, Users, LayoutDashboard, Plus, FileEdit } from "lucide-react";

import { SidebarProps, NavItem } from "./Sidebar.types";
import { useUserStore } from "../../../stores/useUserStore";
import { useUserRole } from "../../../features/auth/hooks/useUserRole";
import { cn } from "@/lib/utils";

const Sidebar: FC<SidebarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore();
  const { isAdmin, isDev } = useUserRole();

  const navItems: NavItem[] = [
    // Admin section
    {
      title: "Questions",
      href: "/admin",
      icon: <FileEdit size={20} />,
      requiresRole: "admin",
    },
    // Dev section
    {
      title: "Users",
      href: "/dev/users",
      icon: <Users size={20} />,
      requiresRole: "dev",
    },
    // Sessions section (all authenticated users)
    {
      title: "My Sessions",
      href: "/dashboard/sessions",
      icon: <LayoutDashboard size={20} />,
      requiresAuth: true,
    },
    {
      title: "Create Session",
      href: "/session/create",
      icon: <Plus size={20} />,
      requiresAuth: true,
    },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (item.requiresRole === "admin") return isAdmin;
    if (item.requiresRole === "dev") return isDev;
    if (item.requiresAuth) return !!user;
    return true;
  });

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false); // Close sidebar on mobile after navigation
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Don't render sidebar if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "sidebar",
          isOpen && "sidebar--open",
          className
        )}
      >
        <div className="sidebar__header">
          <h2 className="sidebar__title">Navigation</h2>
        </div>

        <nav className="sidebar__nav">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "sidebar__nav-item",
                  isActive && "sidebar__nav-item--active"
                )}
              >
                <span className="sidebar__nav-icon">{item.icon}</span>
                <span className="sidebar__nav-text">{item.title}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
