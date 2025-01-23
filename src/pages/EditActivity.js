import React, { useState } from "react";
import "./EditActivity.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { db } from "./firebase"; // Asegúrate de tener tu configuración de Firebase
import { collection, addDoc } from "firebase/firestore"; 

const EditActivity = ({ activity, onSave }) => {
  const [description, setDescription] = useState(activity?.description || "");
  const [rating, setRating] = useState(activity?.rating || 0);
  const navigate = useNavigate();

  const handleSave = async (e) => {  // Función async para manejar Firestore
    e.preventDefault();
    
    try {
      // Agregar nuevo documento a Firestore
      const docRef = await addDoc(collection(db, "activities"), { 
        descripcio: description,
        valoracio: rating,
        nom: activity?.name || "" // Nombre de la actividad (ajusta según tu estructura)
      });

      console.log("Documento agregado con ID:", docRef.id);
      
      // Opcional: Lógica adicional después de guardar
      onSave?.({ 
        ...activity,
        description,
        rating
      });
      
      navigate("/edit-activity?"); // Redirigir a otra página después de guardar

    } catch (error) {
      console.error("Error al agregar documento:", error);
    }
  };

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  return (
    <div className="edit-activity-container">
      <h1 className="logo">ROUTECRAFT</h1>
      <h2>EDITA L'ACTIVITAT</h2>
      <form className="edit-activity-form" onSubmit={handleSave}>
        <label htmlFor="activity-name">NOM DE L'ACTIVITAT:</label>
        <input
          type="text"
          id="activity-name"
          value={activity?.name || ""}
          disabled
        />

        <label htmlFor="activity-description">DESCRIPCIÓ:</label>
        <textarea
          id="activity-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Escriu una descripció per l'activitat..."
          rows="5"
        />

        <label>VALORACIÓ:</label>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? "selected" : ""}`}
              onClick={() => handleStarClick(star)}
            >
              ★
            </span>
          ))}
        </div>

        <button type="submit">Guardar Canvis</button>
      </form>

      <div className="footer-button-container">
      <button
        onClick={() => navigate(`/edit-activity?`)}
        className="edit-button"
      >
        TORNAR ENRRERE
       </button>
    </div>
    </div>
  );
};

export default EditActivity;