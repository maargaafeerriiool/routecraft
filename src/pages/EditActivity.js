import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase"; // Importa la configuració de Firebase

const EditActivity = ({ activity, onSave }) => {
  const [description, setDescription] = useState(activity.description || "");
  const [rating, setRating] = useState(activity.rating || 0);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // Validació dels camps
    if (rating < 1 || rating > 5) {
      alert("La valoració ha de ser entre 1 i 5");
      return;
    }

    if (description.trim() === "") {
      alert("La descripció no pot estar buida.");
      return;
    }

    setLoading(true);

    try {
      // Referència al document de l'activitat a Firestore
      const activityDocRef = doc(db, "activities", activity.id);

      // Actualitza els camps de l'activitat
      await updateDoc(activityDocRef, {
        description,
        rating,
      });

      alert("Activitat actualitzada correctament!");

      // Notifica al component pare
      onSave({ ...activity, description, rating });
    } catch (error) {
      console.error("Error actualitzant l'activitat:", error);
      alert("No s'ha pogut actualitzar l'activitat.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-activity-container">
      <h2>Edita Activitat</h2>
      <form className="edit-activity-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          <strong>Valoració (1-5):</strong>
          <input
            type="number"
            value={rating}
            min="1"
            max="5"
            onChange={(e) => setRating(Number(e.target.value))}
          />
        </label>
        <label>
          <strong>Descripció:</strong>
          <textarea
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>
        <button type="button" onClick={handleSave} disabled={loading}>
          {loading ? "Guardant..." : "Desa canvis"}
        </button>
      </form>
    </div>
  );
};

export default EditActivity;