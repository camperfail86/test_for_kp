import React from 'react';
import './App.css';
import AllKino from "./components/all_kino/all_kino";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KinoSite from "./components/kino_site/kinoSite";
import Favorite from "./components/favorite/favorite";

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={
                  <div className="App">
                      <main className="main">
                          <AllKino/>
                    </main>
                  </div>
              } />
              <Route path="/kino/:id" element={<KinoSite/>}/>
              <Route path="/favorite/" element={<Favorite/>}/>
          </Routes>
      </Router>
  );
}

export default App;
