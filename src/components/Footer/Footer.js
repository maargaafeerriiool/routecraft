import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-item active">
        <i className="fas fa-home"></i>
        <span>Home</span>
      </div>
      <div className="footer-item">
        <i className="fas fa-route"></i>
        <span>Routes</span>
      </div>
      <div className="footer-item">
        <i className="fas fa-user"></i>
        <span>Profile</span>
      </div>
      <div className="footer-item">
        <i className="fas fa-cog"></i>
        <span>Settings</span>
      </div>
    </div>
  );
};

export default Footer;