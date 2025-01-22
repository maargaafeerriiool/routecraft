import React, { useEffect } from "react";
import "./Welcome.css";
import runnerImage from './runnerImage.jpeg';
import { CLIENT_ID } from "../apiKeys"; // Importa tu CLIENT_ID

const Welcome = () => {
  useEffect(() => {
    // Redirigir a OAuth de Strava después de 500ms
    setTimeout(() => {
      window.location.href = 
        `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/stravadata&scope=read,activity:read`;
    }, 1000);
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  return (
    <div className="welcome-container">
      <div className="header">
        <h1 className="logo">ROUTECRAFT</h1>
      </div>
      <div className="welcome-content">
        <div className="profile-picture">
          <img src={runnerImage} alt="Runner" className="runnerImage" />
        </div>
        <div className="welcome-message">
          <h2 className="welcome-text">WELCOME!</h2>
          <p>Redirecting to Strava...</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;