import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup/Signup";
import Payment from "./pages/Payment/Payment.js";
import Carousel from "./components/Carousel/Carousel";
import Login from "./pages/Login/Login";

// Componente para proteger rutas
const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const [user, setUser] = useState(false); // Estado de autenticación

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/"
            element={user ? <Navigate to="/payment" /> : <Carousel />}
          />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />

          {/* Ruta protegida */}
          <Route
            path="/payment"
            element={
              <ProtectedRoute user={user}>
                <Payment />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
