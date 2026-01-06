import EditQuestions from "../../pages/EditQuestions";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Quizz from "../../pages/Quizz";
import UserManagement from "../../pages/UserManagement";
import ActiveSession from "../../pages/ActiveSession";
import JoinSession from "../../pages/JoinSession";
import CreateSession from "../../pages/CreateSession";
import CreatorDashboard from "../../pages/CreatorDashboard";
import SessionResultsPage from "../../pages/SessionResultsPage";
import Profile from "../../pages/Profile";
import WaitingRoom from "../../features/session/components/WaitingRoom/WaitingRoom";
import { MagicLinkVerification } from "../../features/auth/components/MagicLinkVerification";
import { RoleChecker } from "../../features/auth/components/RoleChecker";
import AuthChecker from "../../features/auth/components/Auth/AuthChecker";
import {UsersIcon, HomeIcon, SettingsIcon, CircleQuestionMarkIcon, Edit2Icon, ListStartIcon, LogInIcon, UserIcon, type LucideIcon } from "lucide-react";

export interface RouteType {
  path: string;
  component: any;
  name: string;
  protected: boolean;
  icon?: LucideIcon;
  group?: string;
}

const routes: RouteType[] = [
  {
    path: "/",
    component: Home,
    name: "Home",
    protected: false,
    icon: HomeIcon,
  },
  {
    path: "/quizz",
    component: Quizz,
    name: "Quizz",
    protected: false,
    icon: CircleQuestionMarkIcon,
  },
  {
    path: "/profile",
    component: Profile,
    name: "Profile",
    protected: true,
    icon: UserIcon,
  },
  {
    path: "/admin/edit-questions",
    component: () => (
      <RoleChecker allowedRoles={['admin', 'dev']}>
        <EditQuestions />
      </RoleChecker>
    ),
    name: "Edit questions",
    protected: true,
    icon: Edit2Icon,
    group: "Admin"
  },
  {
    path: "/admin/users",
    component: () => (
      <RoleChecker allowedRoles={['dev']}>
        <UserManagement />
      </RoleChecker>
    ),
    name: "Users",
    protected: true,
    icon: UsersIcon,
    group: "Admin"
  },
  {
    path: "/sessions",
    component: () => (
      <AuthChecker>
        <CreatorDashboard />
      </AuthChecker>
    ),
    name: "My sessions",
    protected: true,
    icon: ListStartIcon,
    group: "Sessions"
  },
  {
    path: "/sessions/create",
    component: () => (
      <AuthChecker>
        <CreateSession />
      </AuthChecker>
    ),
    name: "Create session",
    protected: true,
    icon: ListStartIcon,
    group: "Sessions"
  },
  {
    path: "/sessions/join",
    component: JoinSession,
    name: "Join session",
    protected: false,
    icon: ListStartIcon,
    group: "Sessions"
  },
  {
    path: "/sessions/:sessionId/waiting",
    component: WaitingRoom,
    name: "Waiting room",
    protected: false,
    icon: ListStartIcon,
    group: "Sessions"
  },
  {
    path: "/sessions/:sessionId/results",
    component: SessionResultsPage,
    name: "Session results",
    protected: false,
    icon: ListStartIcon,
    group: "Sessions"
  },
  {
    path: "/sessions/:sessionId",
    component: ActiveSession,
    name: "Session",
    protected: false,
    icon: ListStartIcon,
    group: "Sessions"
  },
  {
    path: "/login",
    component: Login,
    name: "Login",
    protected: false,
    icon: LogInIcon,
  },
  {
    path: "/auth/verify",
    component: MagicLinkVerification,
    name: "MagicLinkVerification",
    protected: false,
    icon: LogInIcon,
  },
];

export default routes;


