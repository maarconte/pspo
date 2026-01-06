import "./style.scss";
import "./style-mobile.scss";

import { FC, useMemo } from "react";
import { User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useUserStore } from "../../../stores/useUserStore";
import { useSessionStore } from "../../../features/session/stores/useSessionStore";
import routes from "../../../utils/routes";
import logo from "../../../assets/img/logo.png";
import { HeaderProps } from "./Header.types";

interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Header Component - Navigation et breadcrumb
 * Optimisé React 19 + Zustand
 */
const Header: FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Sélecteurs Zustand optimisés
  const user = useUserStore((s) => s.user);
  const shareCode = useSessionStore((s) => s.activeSession?.shareCode);

  /**
   * Vérifie si un segment est un UUID Firebase
   */
  const isFirebaseUid = (segment: string): boolean => {
    return segment.length >= 20 && segment.includes('-');
  };

  /**
   * Génère les éléments du breadcrumb
   */
  const breadcrumbItems = useMemo((): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);

    if (pathSegments.length === 0) {
      return [{ name: 'Home', path: '/' }];
    }

    const items: BreadcrumbItem[] = [{ name: 'Home', path: '/' }];
    let currentPath = '';

    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;

      // Chercher une route correspondante
      const route = routes.find((r) => r.path === currentPath);

      if (route) {
        items.push({
          name: route.name,
          path: currentPath,
        });
      } else {
        // Si c'est un UUID de session, utiliser le shareCode'
        const isUUID = segment.length >= 20;
        const displayName = isUUID && shareCode
          ? shareCode
          : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

        items.push({
          name: displayName,
          path: currentPath,
        });
      }
    });

    return items;
  }, [location.pathname, shareCode]);

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

      {user && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <div key={item.path} className="contents">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === breadcrumbItems.length - 1 ? (
                    <BreadcrumbPage className="font-bold">{item.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.path}>{item.name}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

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
