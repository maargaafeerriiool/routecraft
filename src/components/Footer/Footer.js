import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-icon">
        <img src="https://img.icons8.com/material-rounded/50/home.png" alt="Home" />
        <span>Home</span>
      </div>
      <div className="footer-icon">
        <img src="https://img.icons8.com/material-outlined/50/map.png" alt="Map" />
        <span>Map</span>
      </div>
      <div className="footer-icon">
        <img src="https://img.icons8.com/material-rounded/50/user.png" alt="Profile" />
        <span>Profile</span>
      </div>
    </div>
  );
};

export default Footer;
