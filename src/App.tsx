import "./assets/scss/style.scss";

import { QueryClientProvider } from "react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AuthChecker from "./features/auth/components/Auth/AuthChecker";
import { IdleTimeoutHandler } from "./features/auth/components/IdleTimeoutHandler";
import { Header, Sidebar } from "./ui";
import { QuestionsLoader } from "./features/quiz";
import routes from "./utils/routes";
import { queryClient } from "./lib/react-query/queryClient";



function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IdleTimeoutHandler />
      <QuestionsLoader>
        <Router>
          <div className="app-layout">
            <Sidebar />
            <div className="main-content">
              <Header />
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
          </div>
        </Router>
      </QuestionsLoader>
    </QueryClientProvider>
  );
}

export default App;
