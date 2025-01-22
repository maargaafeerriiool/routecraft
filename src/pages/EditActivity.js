  import React, { useState, useEffect } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import { doc, getDoc, setDoc } from "firebase/firestore";
  import { db } from "./firebase"; // Importa la instància de Firestore

  function EditActivity() {
    const { activityId } = useParams(); // Obté l'ID de l'activitat des de la URL
    const navigate = useNavigate();

    const [description, setDescription] = useState("");
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Carrega la informació existent de l'activitat si ja té descripció i puntuació
    useEffect(() => {
      const fetchActivityData = async () => {
        try {
          setLoading(true);
          const docRef = doc(db, "activities", activityId); // Ruta al document a Firebase
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setDescription(data.description || "");
            setRating(data.rating || 0);
          }
        } catch (err) {
          setError("No s'ha pogut carregar la informació de l'activitat.");
        } finally {
          setLoading(false);
        }
      };

      fetchActivityData();
    }, [activityId]);

    // Funció per guardar la descripció i puntuació a Firebase
    const handleSave = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "activities", activityId); // Ruta al document a Firebase
        await setDoc(docRef, { description, rating }, { merge: true }); // Desem o actualitzem les dades
        navigate("/"); // Redirigeix a la pàgina principal després de guardar
      } catch (err) {
        setError("No s'ha pogut desar la informació.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div style={{ padding: "2em", textAlign: "center" }}>
        <h1>Editar Activitat</h1>
        {loading && <p>Carregant...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ margin: "2em 0" }}>
          <textarea
            placeholder="Afegeix una descripció"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "80%",
              height: "100px",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ margin: "2em 0" }}>
          <p>Puntuació:</p>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                fontSize: "2em",
                cursor: "pointer",
                color: star <= rating ? "#f5c518" : "#ccc",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <button
          onClick={handleSave}
          style={{
            padding: "10px 20px",
            fontSize: "1.2em",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Desa
        </button>
      </div>
    );
  }

  export default EditActivity;