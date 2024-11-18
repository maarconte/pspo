import "./assets/scss/style.scss";

import { HashRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";

import EditQuestions from "./pages/EditQuestions";
import { Firebase } from "./firebase.js";
import Home from "./pages/Home";
import { QuestionsProvider } from "./utils/context";
import Quizz from "./pages/Quizz";

const queryClient = new QueryClient();

function App() {
  const db = getFirestore(Firebase);
  const questionsCollection = collection(db, "questions");

  // const addQuestions = async () => {
  //   try {
  //     questionsJSON.forEach(async (question: any) => {
  //       await addDoc(questionsCollection, question);
  //     });
  //     console.log("success");
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  // };

  useEffect(() => {
    // only add questions once
    // addQuestions();
  }, []);

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
