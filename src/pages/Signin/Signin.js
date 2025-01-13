import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signin.css";
import PeopleRunning from "./PeopleRunning.png";
import ubicacio from "./ubicacio.gif";

// 1) Import de Firebase Auth
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../firebase";

// 2) Importa el teu client ID de Strava (o canvia la ruta a on el tinguis)
import { CLIENT_ID } from "../apiKeys"; 

const Signin = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Actualitza l’estat dels inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Quan premem Sign In
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 3) Configurem la persistència (browserLocalPersistence)
      await setPersistence(auth, browserLocalPersistence);

      // 4) Fem signIn a Firebase amb Email & Password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("User signed in:", userCredential.user);

      // 5) Indiquem a l’estat local que l’usuari està loguejat (si ho necessites)
      if (setUser) setUser(true);

      // 6) Esperem un moment perquè Firebase consolidi l’usuari
      setTimeout(() => {
        // Redirigim a l’OAuth de Strava
        window.location.href = 
          `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/stravadata&scope=read,activity:read`;
      }, 500);

    } catch (error) {
      console.error("Error signing in:", error.message);
      alert(error.message);
    }
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
            objectFit: "contain",
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
          onChange={handleChange}
          required
        />

        <label htmlFor="password">PASSWORD</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
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
            marginTop: "20px",
          }}
        />
      </div>
    </div>
  );
};

export default Signin;