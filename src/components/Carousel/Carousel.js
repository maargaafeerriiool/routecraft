import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para redirección
import "./Carousel.css";
import Mapa from "./Mapa.png";
import Goals from "./Goals.png";
import Run from "./Run.png";

const slides = [
  {
    image: Mapa,
    text: "Track your life in one place",
  },
  {
    image: Goals,
    text: "Make progress toward goals",
  },
  {
    image: Run,
    text: "Route options that never run out",
  },
];

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate(); // Hook para redirección

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Cambia cada 5 segundos
    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);

  return (
    <div className="carousel-container">
      <h1 className="logo">ROUTECRAFT</h1>
      <div className="carousel-slide">
        <img
          src={slides[currentSlide].image}
          alt={`Slide ${currentSlide + 1}`}
          className="carousel-image"
        />
        <p className="carousel-text">{slides[currentSlide].text}</p>
      </div>
      <div className="carousel-buttons">
        {/* Redirige a la página de inicio de sesión */}
        <button className="auth-button" onClick={() => navigate("/signin")}>
          SIGN IN
        </button>
        {/* Redirige a la página de registro */}
        <button className="auth-button" onClick={() => navigate("/signup")}>
          SIGN UP
        </button>
      </div>
    </div>
  );
};

export default Carousel;
