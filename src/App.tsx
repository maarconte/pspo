import "./assets/scss/style.scss";
import "rsuite/dist/rsuite.min.css";

import { Footer, Header, Loader } from "./ui";
import { Route, HashRouter as Router, Routes } from "react-router-dom";

import AuthChecker from "./features/auth/components/Auth/AuthChecker";
import { CoopDrawer } from "./features/coop/components/CoopDrawer/CoopDrawer";
import { DocumentationDrawer } from "./features/documentation/components/DocumentationDrawer/DocumentationDrawer";
import { InfoPopup } from "./features/info-popup/components/InfoPopup/InfoPopup";
import { MagicLinkRedirector } from "./features/auth/components/MagicLinkRedirector/MagicLinkRedirector";
import { QueryClientProvider } from "@tanstack/react-query";
import { QuestionsLoader } from "./features/quiz";
import { Suspense } from "react";
import { UsefulLinksDrawer } from "./features/useful-links/components/UsefulLinksDrawer/UsefulLinksDrawer";
import { queryClient } from "./lib/react-query/queryClient";
import routes from "./utils/routes";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <CoopDrawer />
        <DocumentationDrawer />
        <UsefulLinksDrawer />
        <InfoPopup />
        <QuestionsLoader>
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
          <Footer />
        </QuestionsLoader>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
