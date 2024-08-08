import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/home'
import Treinos from './pages/treinos'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/treinos" element={<Treinos />} />
      </Routes>
    </Router>
  );
}

export default App;