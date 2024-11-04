import "./assets/scss/style.scss";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import { QuestionsProvider } from "./utils/context";
import Quizz from "./pages/Quizz";

function App() {
  return (
    <QuestionsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quizz" element={<Quizz />} />
        </Routes>
      </BrowserRouter>
    </QuestionsProvider>
  );
}

export default App;
