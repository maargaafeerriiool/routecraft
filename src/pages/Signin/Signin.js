import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Signin.css';

const Signin = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(true);
    navigate("/payment");
  };

  return (
    <div className="login-container">
      <h1 className="logo">ROUTECRAFT</h1>
      <div className="profile-picture">
        <p>150 x 150</p>
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="email">EMAIL</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <label htmlFor="password">PASSWORD</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit" className="login-button">SIGN IN</button>
      </form>
      <div className="map-image">
        <p>500 x 800</p>
      </div>
    </div>
  );
};

export default Signin;
