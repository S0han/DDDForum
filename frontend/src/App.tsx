import "./App.css";
import React from 'react';

import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { MainPage } from "./pages/mainPage";

function App() {
  return (
    <BrowserRouter>
      <meta name="color-scheme" content="light only"></meta>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;