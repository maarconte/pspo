import "./assets/scss/style.scss";

import { QueryClientProvider } from "react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AuthChecker from "./features/auth/components/Auth/AuthChecker";
import { IdleTimeoutHandler } from "./features/auth/components/IdleTimeoutHandler";
import { QuestionsLoader } from "./features/quiz";
import routes from "./utils/routes";
import { queryClient } from "./lib/react-query/queryClient";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useUserStore } from "./features/auth/stores/useAuthStore";
import Header from "@/ui/Layout/Header/Header";


function App() {
  const user = useUserStore((state) => state.user);

  return (
    <QueryClientProvider client={queryClient}>
      <IdleTimeoutHandler />
      <QuestionsLoader>
        <Router>
          <SidebarProvider>
            {user && <AppSidebar />}
            <SidebarInset className={!user ? "md:!ml-0" : ""}>
                <Header/>
              <div className="flex flex-1 flex-col gap-4 p-4">
                <Routes>
                  {routes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        route.protected ? (
                          <AuthChecker>
                            <route.component />
                          </AuthChecker>
                        ) : (
                          <route.component />
                        )
                      }
                    />
                  ))}
                </Routes>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </Router>
      </QuestionsLoader>
    </QueryClientProvider>
  );
}

export default App;
