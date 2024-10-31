import React from 'react';
import './Home.css';
import FonsDegradat from './FonsDegradat.png'; // Imatge de fons
import RunnersImage from './PeopleRunning.png'; // Imatge de figures corrent
import RouteImage from './Route.png'; // Imatge del recorregut

function Home() {
  return (
    <div
      className="home-background"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255, 165, 0, 0.7), rgba(255, 0, 0, 0.5)), url(${FonsDegradat})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Centra tots els elements horitzontalment
        justifyContent: "center", // Centra verticalment el contingut
        position: "relative",
      }}
    >
      {/* Títol centrat */}
      <div className="form-container" style={{ textAlign: "center", color: "white", position: "relative", zIndex: 2 }}>
        <h1 className="gradient-text">ROUTECRAFT</h1>
      </div>

      {/* Imatge de figures corrent a sobre del text */}
      <img 
        src={RunnersImage} 
        alt="Figures corrent" 
        className="runners-image" 
      />
      
      {/* Distribució de diverses imatges del recorregut */}
      <div className="routes-container">
        <img src={RouteImage} alt="Recorregut 1" className="route-image" />
        <img src={RouteImage} alt="Recorregut 2" className="route-image" />
        <img src={RouteImage} alt="Recorregut 3" className="route-image" />
      </div>
    </div>
  );
}

export default Home;
