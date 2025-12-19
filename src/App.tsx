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



function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IdleTimeoutHandler />
      <QuestionsLoader>
        <Router>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="ml-1" />
              </header>
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
