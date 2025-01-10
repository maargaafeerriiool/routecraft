import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Signin.css';
import PeopleRunning from './PeopleRunning.png';
import ubicacio from './ubicacio.gif';

const Signin = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  
  // Ja no cal fer servir 'navigate' per anar a stravadata directament,
  // perquè anirem a l'OAuth de Strava. Tot i així, el mantenim per si el necessitem.
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí validaríem credencials. En aquest exemple, ho donem per bo.
    setUser(true);

    // Just després de validar l'usuari, el redirigim a l’URL d’autorització de Strava.
    window.location.href = 
      "https://www.strava.com/oauth/authorize?client_id=142793&response_type=code&redirect_uri=http://localhost:3000/stravadata&scope=read,activity:read";
  };

  return (
    <div className="signin-container">
      <h1 className="logo">ROUTECRAFT</h1>
      <div className="profile-picture">
        <img
          src={PeopleRunning}
          alt="Profile"
          style={{
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "5px",
            width: "150px",
            height: "150px",
            objectFit: "contain"
          }}
        />
      </div>
      <form onSubmit={handleSubmit} className="signin-form">
        <label htmlFor="email">EMAIL</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
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
        <button type="submit" className="signin-button">
          SIGN IN
        </button>
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