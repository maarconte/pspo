import "./assets/scss/style.scss";

import { HashRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import EditQuestions from "./pages/EditQuestions";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { QuestionsProvider } from "./utils/context";
import Quizz from "./pages/Quizz";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <QuestionsProvider>
        <HashRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quizz" element={<Quizz />} />
            <Route path="/admin" element={<EditQuestions />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </HashRouter>
      </QuestionsProvider>
    </QueryClientProvider>
  );
}

export default App;
