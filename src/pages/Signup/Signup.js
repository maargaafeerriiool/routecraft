import React from "react";
import { useNavigate } from "react-router-dom"; // Hook para redirección
import "./Signup.css";

const Signup = ({ setUser }) => {
  const navigate = useNavigate(); // Hook para redirección

  const handleSignUp = (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario
    setUser(true); // Actualiza el estado del usuario
    navigate("/payment"); // Redirige a la página de pago
  };

  return (
    <div className="signup-container">
      <header className="signup-header">
        <h1 className="logo">ROUTECRAFT</h1>
      </header>
      <form className="signup-form" onSubmit={handleSignUp}>
        <div className="form-row">
          <input type="text" placeholder="NAME" className="input-field" required />
          <input type="text" placeholder="SURNAMES" className="input-field" required />
        </div>
        <input type="email" placeholder="EMAIL" className="input-field full-width" required />
        <input type="password" placeholder="CREATE PASSWORD" className="input-field full-width" required />
        <input type="password" placeholder="CONFIRM PASSWORD" className="input-field full-width" required />
        <button type="submit" className="create-account-btn">CREATE ACCOUNT</button>
      </form>
    </div>
  );
};

export default Signup;
