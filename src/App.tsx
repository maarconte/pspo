import "./assets/scss/style.scss";

import { QueryClient, QueryClientProvider } from "react-query";
import { Route, HashRouter as Router, Routes } from "react-router-dom";

import AuthChecker from "./components/Auth/AuthChecker";
import Header from "./components/Header";
import { QuestionsLoader } from "./components/QuestionsLoader";
import routes from "./utils/routes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <QuestionsLoader>
        <Router>
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
        </Router>
      </QuestionsLoader>
    </QueryClientProvider>
  );
}

export default App;
