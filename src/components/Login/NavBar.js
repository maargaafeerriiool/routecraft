import React from 'react';
import './Login/NavBar.css'; // Optional: create a separate CSS file for styling

function NavBar() {
  return (
    <div className="nav-bar">
      <button className="nav-button">
        <img src="path/to/home-icon.png" alt="Home" className="nav-icon" />
      </button>
      <button className="nav-button">
        <img src="path/to/map-icon.png" alt="Map" className="nav-icon" />
      </button>
      <button className="nav-button">
        <img src="path/to/center-icon.png" alt="Center" className="nav-icon" />
      </button>
      <button className="nav-button">
        <img src="path/to/profile-icon.png" alt="Profile" className="nav-icon" />
      </button>
    </div>
  );
}

export default NavBar;
