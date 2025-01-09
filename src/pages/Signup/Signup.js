import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      setUser(true); // Mark user as authenticated
      navigate("/welcome"); // Redirect to welcome page
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="logo">ROUTECRAFT</h1>
      <div className="profile-picture">
        <p>150 x 150</p>
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
