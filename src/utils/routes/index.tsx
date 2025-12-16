import EditQuestions from "../../pages/EditQuestions";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Quizz from "../../pages/Quizz";
import UserManagement from "../../pages/UserManagement";
import ActiveSession from "../../pages/ActiveSession";
import JoinSession from "../../pages/JoinSession";
import CreateSession from "../../pages/CreateSession";
import CreatorDashboard from "../../pages/CreatorDashboard";
import WaitingRoom from "../../features/session/components/WaitingRoom/WaitingRoom";
import { MagicLinkVerification } from "../../features/auth/components/MagicLinkVerification";
import { RoleChecker } from "../../features/auth/components/RoleChecker";
import AuthChecker from "../../features/auth/components/Auth/AuthChecker";

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
    path: "/dashboard/sessions",
    component: () => (
      <AuthChecker>
        <CreatorDashboard />
      </AuthChecker>
    ),
    name: "CreatorDashboard",
    protected: true,
  },
  {
    path: "/session/create",
    component: () => (
      <AuthChecker>
        <CreateSession />
      </AuthChecker>
    ),
    name: "CreateSession",
    protected: true,
  },
  {
    path: "/session/join",
    component: JoinSession,
    name: "JoinSession",
    protected: false,
  },
  {
    path: "/session/:sessionId/waiting",
    component: WaitingRoom,
    name: "WaitingRoom",
    protected: false,
  },
  {
    path: "/session/:sessionId",
    component: ActiveSession,
    name: "ActiveSession",
    protected: false,
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


