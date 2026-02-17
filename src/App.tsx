import "./assets/scss/style.scss";

import { QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Suspense } from "react";

import AuthChecker from "./features/auth/components/Auth/AuthChecker";
import { IdleTimeoutHandler } from "./features/auth/components/IdleTimeoutHandler";
import { Header, Loader } from "./ui";
import { QuestionsLoader } from "./features/quiz";
import routes from "./utils/routes";
import { queryClient } from "./lib/react-query/queryClient";



import { MagicLinkRedirector } from "./features/auth/components/MagicLinkRedirector/MagicLinkRedirector";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IdleTimeoutHandler />
      <QuestionsLoader>
        <Router basename={import.meta.env.BASE_URL}>
          <MagicLinkRedirector />
          <Header />
          <Suspense fallback={<Loader />}>
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
          </Suspense>
        </Router>
      </QuestionsLoader>
    </QueryClientProvider>
  );
}

export default App;
