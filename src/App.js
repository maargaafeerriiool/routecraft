import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Signup from "./pages/Signup/Signup";
import Payment from "./pages/Payment/Payment";
import Carousel from "./components/Carousel/Carousel";
import Signin from "./pages/Signin/Signin";
import Footer from "./components/Footer/Footer";

const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/signin" />;
};

function App() {
  const [user, setUser] = useState(false);

  return (
    <Router>
      <div className="App">
        <div className="content">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/payment" /> : <Carousel />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/signin" element={<Signin setUser={setUser} />} />
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
        {/* Render Footer conditionally */}
        <FooterVisibility />
      </div>
    </Router>
  );
}

const FooterVisibility = () => {
  const location = useLocation();
  const isCarouselPage = location.pathname === "/"; // Check if current route is the Carousel

  return !isCarouselPage ? <Footer /> : null; // Render footer only if not on the Carousel page
};

export default App;
