import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Ajusta la ruta si cal
import "./Signup.css";

const Signup = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surnames: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Registre l'usuari a Firebase
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      setUser(true); // Marca l'usuari com autenticat
      navigate("/welcome"); // Redirigeix a la pàgina de benvinguda
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="signup-container">
      <header className="signup-header">
        <h1 className="logo">ROUTECRAFT</h1>
      </header>
      <form className="signup-form" onSubmit={handleSignUp}>
        <div className="form-row">
          <input
            type="text"
            name="name"
            placeholder="NAME"
            className="input-field"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="surnames"
            placeholder="SURNAMES"
            className="input-field"
            value={formData.surnames}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="EMAIL"
          className="input-field full-width"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="CREATE PASSWORD"
          className="input-field full-width"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="CONFIRM PASSWORD"
          className="input-field full-width"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit" className="create-account-btn">CREATE ACCOUNT</button>
      </form>
    </div>
  );
};

export default Signup;
