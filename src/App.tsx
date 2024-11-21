import "./assets/scss/style.scss";

import { HashRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import AuthChecker from "./components/Auth/AuthChecker";
import Header from "./components/Header";
import { QuestionsProvider } from "./utils/context";
import UserContextProvider from "./utils/context/UserContext";
import routes from "./utils/routes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <QuestionsProvider>
          <HashRouter>
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
          </HashRouter>
        </QuestionsProvider>
      </UserContextProvider>
    </QueryClientProvider>
  );
}

export default App;
