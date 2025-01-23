import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate per redirecció
import "./Carousel.css";
import Mapa from "./Mapa.png";
import Goals from "./Goals.png";
import Run from "./Run.png";
import Footer from "../../components/Footer/Footer"; // Ajusta el camí segons la teva estructura

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
  const navigate = useNavigate(); // Hook per redirecció

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Canvia cada 5 segons
    return () => clearInterval(interval); // Neteja l'interval al desmuntar
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
        {/* Redirigeix a la pàgina de login */}
        <button className="auth-button" onClick={() => navigate("/signin")}>
          SIGN IN
        </button>
        {/* Redirigeix a la pàgina de registre */}
        <button className="auth-button" onClick={() => navigate("/signup")}>
          SIGN UP
        </button>
        </div>
    </div>
  );
};

export default Carousel;