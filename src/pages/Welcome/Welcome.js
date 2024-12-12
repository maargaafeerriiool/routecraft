import React from "react";
import "./Welcome.css";
import runnerImage from "./runner.jpg"; // Cambia por la ruta real de tu imagen

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="header">
        <h2 className="salutacio">SALUTACIÓ</h2>
        <h1 className="logo">ROUTECRAFT</h1>
      </div>
      <div className="welcome-content">
        <div className="profile-picture">
          <img src={runnerImage} alt="Runner" className="profile-image" />
        </div>
        <div className="welcome-message">
          <h2 className="welcome-text">WELCOME!</h2>
        </div>
        <button className="start-button">
          <span role="img" aria-label="Start Icon">🏃‍♀️</span> START!
        </button>
      </div>
    </div>
  );
};

export default Welcome;
