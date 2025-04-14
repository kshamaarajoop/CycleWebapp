import Tracker from './pages/Tracker'; 
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/tracker" element={<Tracker />} /> 
      </Routes>
    </Router>
  );
}
export default App;
