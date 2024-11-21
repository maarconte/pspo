import EditQuestions from "../../pages/EditQuestions";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Quizz from "../../pages/Quizz";

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
    component: EditQuestions,
    name: "EditQuestions",
    protected: true,
  },
  {
    path: "/login",
    component: Login,
    name: "Login",
    protected: false,
  },
];

export default routes;
