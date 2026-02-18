import { lazy } from "react";
import { RoleChecker } from "../../features/auth/components/RoleChecker";

const EditQuestions = lazy(() => import("../../pages/EditQuestions"));
const Home = lazy(() => import("../../pages/Home"));
const Login = lazy(() => import("../../pages/Login"));
const Quizz = lazy(() => import("../../pages/Quizz"));
const UserManagement = lazy(() => import("../../pages/UserManagement"));
// MagicLinkVerification is a named export, so we need to map it to default
const MagicLinkVerification = lazy(() => import("../../features/auth/components/MagicLinkVerification").then(module => ({ default: module.MagicLinkVerification })));

interface RouteType {
  path: string;
  component: any;
  name: string;
  protected: boolean;
}

const routes: RouteType[] = [
  {
    path: "/",
    component: Home,
    name: "Home",
    protected: false,
  },
  // {
  //   path: "/pspo",
  //   component: Home,
  //   name: "Home",
  //   protected: false,
  // },
  {
    path: "/quizz",
    component: Quizz,
    name: "Quizz",
    protected: false,
  },
  {
    path: "/admin",
    component: () => (
      <RoleChecker allowedRoles={['admin', 'dev']}>
        <EditQuestions />
      </RoleChecker>
    ),
    name: "EditQuestions",
    protected: true,
  },
  {
    path: "/dev/users",
    component: () => (
      <RoleChecker allowedRoles={['dev']}>
        <UserManagement />
      </RoleChecker>
    ),
    name: "UserManagement",
    protected: true,
  },
  {
    path: "/login",
    component: Login,
    name: "Login",
    protected: false,
  },
  {
    path: "/auth/verify",
    component: MagicLinkVerification,
    name: "MagicLinkVerification",
    protected: false,
  },
];

export default routes;
