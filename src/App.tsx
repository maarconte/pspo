import "./assets/scss/style.scss";
import "rsuite/dist/rsuite.min.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AuthChecker from "./features/auth/components/Auth/AuthChecker";
import { Header, Loader } from "./ui";
import { QuestionsLoader } from "./features/quiz";
import routes from "./utils/routes";
import { queryClient } from "./lib/react-query/queryClient";



import { MagicLinkRedirector } from "./features/auth/components/MagicLinkRedirector/MagicLinkRedirector";
import { CoopDrawer } from "./features/coop/components/CoopDrawer/CoopDrawer";
import { DocumentationDrawer } from "./features/documentation/components/DocumentationDrawer/DocumentationDrawer";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router basename={import.meta.env.BASE_URL}>
        <CoopDrawer />
        <DocumentationDrawer />
        <QuestionsLoader>
          <MagicLinkRedirector />
          <Header />
          <Suspense fallback={<Loader />}>
            <div className="p-2">
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
          </Suspense>
        </QuestionsLoader>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
