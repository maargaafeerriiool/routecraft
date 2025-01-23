import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import FonsDegradat from './FonsDegradat.png';
import RunnersImage from './PeopleRunning.png';
import RouteImage from './Route.png';

function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      navigate('/carousel'); // Redirecció automàtica
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="home-background">
      <div className="container">
        {showSplash ? (
          <div className="splash-screen">
            <h1 className="splash-text">BENVINGUT A ROUTECRAFT</h1>
            <img 
              src={RunnersImage} 
              alt="Figures corrent" 
              className="runners-image" 
            />
          </div>
        ) : (
          <div className="form-container">
            <h1 className="gradient-text">ROUTECRAFT</h1>
            <img 
              src={RouteImage} 
              alt="Ruta" 
              className="route-image" 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;