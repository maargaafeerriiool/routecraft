import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Signup from "./pages/Signup/Signup";
import Payment from "./pages/Payment/Payment";
import Welcome from "./pages/Welcome/Welcome";
import Carousel from "./components/Carousel/Carousel";
import Signin from "./pages/Signin/Signin";
import StravaData from "./pages/StravaData";

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
            <Route path="/" element={<Carousel />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/signin" element={<Signin setUser={setUser} />} />
            <Route path="/welcome"element={<ProtectedRoute user={user}><Welcome /> </ProtectedRoute>}/>
            <Route path="/welcome"element={<ProtectedRoute user={user}><Payment /> </ProtectedRoute>}/>
            <Route path="/stravadata" element={<StravaData />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}



export default App;