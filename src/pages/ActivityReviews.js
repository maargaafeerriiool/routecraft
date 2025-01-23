import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./ActivityReviews.css";

const ActivityReviews = () => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Obtenemos todos los documentos de la colección "activities"
        const snapshot = await getDocs(collection(db, "activities"));
        // Mapeamos cada doc a un objeto con su id y datos
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setActivities(data);
      } catch (error) {
        console.error("Error al obtener reseñas de Firestore:", error);
      }
    };

    fetchActivities();
  }, []);

  const handleEdit = (activity) => {
    // Navegar al componente de edición pasando la actividad seleccionada
    navigate("/edit-activity", { state: { activity } });
  };

  return (
    <div className="reviews-container">
      <h1 className="logo">ROUTECRAFT</h1>
      <h2>Reseñas de Actividades</h2>

      {activities.length === 0 ? (
        <p>No hay reseñas aún.</p>
      ) : (
        <div className="reviews-list">
          {activities.map((act) => (
            <div key={act.id} className="review-card">
              <h3>{act.nom || "ACTIVITAT SENSE NOM"}</h3>
              <p>
                <strong>Descripció:</strong> {act.descripcio || "Sense descripció"}
              </p>
              <p>
                <strong>Valoració:</strong> {act.valoracio || 0} / 5
              </p>
              <button onClick={() => handleEdit(act)}>Editar</button>
            </div>
          ))}
        </div>
      )}

      {/* Botón para volver a la pantalla principal o donde quieras */}
      <button 
        className="back-button" 
        onClick={() => navigate("/stravadata")}
      >
        Volver a mis actividades
      </button>
    </div>
  );
};

export default ActivityReviews;