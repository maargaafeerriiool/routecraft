import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Profile from './components/Profile';
import RoutesPage from './components/RoutesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/routes" element={<RoutesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
