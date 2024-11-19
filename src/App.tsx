import "./assets/scss/style.scss";

import { HashRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import EditQuestions from "./pages/EditQuestions";
import Home from "./pages/Home";
import { QuestionsProvider } from "./utils/context";
import Quizz from "./pages/Quizz";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <QuestionsProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quizz" element={<Quizz />} />
            <Route path="/admin" element={<EditQuestions />} />
          </Routes>
        </HashRouter>
      </QuestionsProvider>
    </QueryClientProvider>
  );
}

export default App;
