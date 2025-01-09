import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Signin.css';
import PeopleRunning from './PeopleRunning.png';
import ubicacio from'./ubicacio.gif';

const Signin = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(true); // Marca al usuario como autenticado
    navigate("/welcome"); // Redirige a la página de bienvenida
  };

  return (
    <div className="signin-container">
      <h1 className="logo">ROUTECRAFT</h1>
      <div className="profile-picture">
        <img src={PeopleRunning} alt="Profile" style={{ backgroundColor: "white", borderRadius: "50%", padding: "5px", width: "150px", height: "150px", objectFit: "contain" }} />     
      </div>
      <form onSubmit={handleSubmit} className="signin-form">
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
        <button type="submit" className="signin-button">SIGN IN</button>
      </form>
      <div>
        <img
          src={ubicacio} 
          alt="Loading animation"
          style={{
            objectFit: "contain",
            marginTop: "20px" 
          }}
        />
      </div>
    </div>
  );
};

export default Signin;
