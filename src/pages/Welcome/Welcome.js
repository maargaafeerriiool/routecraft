import React from "react";
import "./Welcome.css";
import runnerImage from './runnerImage.jpeg';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="header">
        <h1 className="logo">ROUTECRAFT</h1>
      </div>
      <div className="welcome-content">
        <div className="profile-picture">
          <img src={runnerImage} alt="runnerImage" className="runnerImage" />
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
