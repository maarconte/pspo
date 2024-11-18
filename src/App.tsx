<<<<<<< HEAD
<<<<<<< HEAD
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
import { questionsJSON } from "./questions.js";

const queryClient = new QueryClient();

function App() {
  const db = getFirestore(Firebase);
  const questionsCollection = collection(db, "questions");

  const addQuestions = async () => {
    try {
      questionsJSON.forEach(async (question: any) => {
        await addDoc(questionsCollection, question);
      });
      console.log("success");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

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
=======
import './App.css';

import React, { useEffect, useState } from 'react';
import { addDoc, collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';

import { Firebase } from "./firebase.js";
import logo from './logo.svg';
import questionsData from './questions.js';

function App() {
  const [questions, setQuestions] = useState([]);

  // Get firestore instance
  const db = getFirestore(Firebase);
  const questionsCollection = collection(db, "questions");

  // Fetch questions on component mount
  const fetchQuestions = async () => {
    const querySnapshot = await getDocs(questionsCollection);
    const fetchedQuestions: any = [];
    querySnapshot.forEach((doc) => {
      fetchedQuestions.push(doc.data());
    });
    setQuestions(fetchedQuestions);
  };
  // const addQuestions = async () => {
  //   try {
  //     questionsData.forEach(async (question) => {
  //       await addDoc(questionsCollection, question);
  //     });
  //     console.log("success")
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  // }

  useEffect(() => {
    fetchQuestions();
  }, []);



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Questions loaded: {questions.length}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
>>>>>>> 75a7503 (fix git)
=======
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
>>>>>>> 34f0f8a (files)
  );
}

export default App;
