import "./assets/scss/style.scss";

import { HashRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import { QuestionsProvider } from "./utils/context";
import Quizz from "./pages/Quizz";

function App() {
  return (
    <QuestionsProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quizz" element={<Quizz />} />
        </Routes>
      </HashRouter>
    </QuestionsProvider>
  );
}

export default App;
