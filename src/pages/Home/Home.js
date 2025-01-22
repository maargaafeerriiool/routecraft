import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import FonsDegradat from './FonsDegradat.png';
import RunnersImage from './PeopleRunning.png';
import RouteImage from './Route.png';

function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate(); // Use navigate for redirection

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      navigate('/carousel'); // Automatically redirect to Login after splash screen
    }, 5000); // Adjust the time as needed
  
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="home-background"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255, 165, 0, 0.7), rgba(255, 0, 0, 0.5)), url(${FonsDegradat})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}
    >
      {showSplash ? (
        <div className="splash-screen">
          <h1 className="splash-text">BENVINGUT A ROUTECRAFT</h1>
          <img 
            src={RouteImage} 
            alt="Route" 
            className="route-image" 
          />
        </div>
      ) : (
        <div className="form-container" style={{ textAlign: "center", color: "white" }}>
          <h1 className="gradient-text">ROUTECRAFT</h1>
          <img 
            src={RunnersImage} 
            alt="Figures corrent" 
            className="runners-image" 
          />
        </div>
      )}
    </div>
  );
}

export default Home;
