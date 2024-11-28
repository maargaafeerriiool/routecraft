import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup/Signup";
import Payment from "./pages/Payment/Payment";
import Carousel from "./components/Carousel/Carousel";

function App() {
  const [user, setUser] = useState(false);

  return (
    <Router>
      <div className="App">
        {user ? (
          <Routes>
            <Route path="/" element={<Payment />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Carousel />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/payment" element={<Payment />} /> {/* Ruta para Payment */}
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
