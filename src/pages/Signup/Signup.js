// src/components/Signup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import PeopleRunning from "./PeopleRunning.png";

// 1) Importem de Firebase Auth
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // El fitxer on inicialitzes Firebase

const Signup = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surnames: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Funció auxiliar per actualitzar l’estat segons l’input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Funció principal: crear usuari a Firebase
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Comprovació bàsica: contrasenyes iguals
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // 2) Creem usuari amb correu i contrasenya a Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // userCredential.user és l'usuari creat
      console.log("User created:", userCredential.user);

      // (Opcional) Podries guardar 'name' i 'surnames' en un Firestore o en userProfile

      // 3) Indiquem a l’estat local que ja està loguejat
      setUser(true);

      // 4) Redirigim on vulguis (p.ex. a "/welcome")
      navigate("/welcome");
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="signup-container">
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

      <form onSubmit={handleSignUp} className="signup-form">
        <label htmlFor="name">NAME</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="surnames">SURNAMES</label>
        <input
          type="text"
          id="surnames"
          name="surnames"
          placeholder="Enter your surnames"
          value={formData.surnames}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">EMAIL</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">CREATE PASSWORD</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="signup-button">SIGN UP</button>
      </form>
    </div>
  );
};

export default Signup;