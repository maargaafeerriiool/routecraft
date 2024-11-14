import React from 'react';
import './Login.css'; // You can add custom styles here if needed

function Login() {
  return (
    <div className="login-container">
      <h1 className="login-title">ROUTECRAFT</h1>
      <div className="login-image-container">
        {/* Replace with the actual map image or an image URL */}
        <img
          src="your-map-image-path.jpg" // Replace with your actual image path
          alt="Map"
          className="login-image"
        />
      </div>
      <p className="login-tagline">Track your life in one place</p>
      <button className="login-button">SIGN IN</button>
      <button className="signup-button">SIGN UP</button>
    </div>
  );
}

export default Login;
