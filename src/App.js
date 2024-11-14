// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home'; // Example Home component
import Login from './components/Login/Login'; // Import your Login component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Default route */}
        <Route path="/login" element={<Login />} /> {/* Route for the login screen */}
      </Routes>
    </Router>
  );
}

export default App;
