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
  );
}

export default App;
