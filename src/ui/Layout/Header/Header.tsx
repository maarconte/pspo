import "./style.scss";
import "./style-mobile.scss";

import React, { FC, useMemo } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderProps } from "./Header.types";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../stores/useUserStore";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import routes from "../../../utils/routes";

import logo from "../../../assets/img/logo.png";

const Header: FC<HeaderProps> = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Generate breadcrumb items based on current path
  const breadcrumbItems = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);

    if (pathSegments.length === 0) {
      return [{ name: 'Home', path: '/' }];
    }

    const items = [{ name: 'Home', path: '/' }];
    let currentPath = '';

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Find matching route
      const route = routes.find(r => r.path === currentPath);

      if (route) {
        items.push({
          name: route.name,
          path: currentPath
        });
      } else {
        // Capitalize segment if no route found
        items.push({
          name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          path: currentPath
        });
      }
    });

    return items;
  }, [location.pathname]);

  return (
    <div className="Header flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex items-center gap-2">
      {user && <SidebarTrigger className="ml-1" />}
        <h1 className="text-2xl font-bold mb-0">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-16 w-auto" />
          </Link>
          </h1>
      </div>
    {user &&  <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.path}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {index === breadcrumbItems.length - 1 ? (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.path}>{item.name}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>}

        {!user && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/login")}
          className="ml-auto"
        >
          <User size={16} />
          Login
        </Button>
        )}


    </div>
  );
};

export default Header;
