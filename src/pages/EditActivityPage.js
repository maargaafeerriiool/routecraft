import React, { useState } from "react";
import "./EditActivity.css";

const activitiesExample = [
  {
    id: "12345",
    name: "Lunch Run",
    description: "Cursa ràpida al migdia",
    rating: 4,
  },
  {
    id: "67890",
    name: "Morning Walk",
    description: "Passeig matinal tranquil",
    rating: 5,
  },
  {
    id: "11112",
    name: "Evening Ride",
    description: "Passeig en bicicleta per la tarda",
    rating: 3,
  },
];

const EditActivity = ({ activity, onSave }) => {
  const [description, setDescription] = useState(activity?.description || "");
  const [rating, setRating] = useState(activity?.rating || 0);

  const handleSave = (e) => {
    e.preventDefault();
    const updatedData = {
      ...activity,
      description,
      rating,
    };
    onSave(updatedData);
  };

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  return (
    <div className="edit-activity-container">
      <h2>EDITA L'ACTIVITAT</h2>
      <form className="edit-activity-form" onSubmit={handleSave}>
        <label htmlFor="activity-name">Nom de l'Activitat:</label>
        <input type="text" id="activity-name" value={activity.name} disabled />

        <label htmlFor="activity-description">Descripció:</label>
        <textarea
          id="activity-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Escriu una descripció per l'activitat..."
          rows="5"
        />

        <label>Valoració:</label>
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
    </div>
  );
};

const EditActivityPage = () => {
  const [selectedActivity, setSelectedActivity] = useState(null); // Estat per l'activitat seleccionada
  const [activities, setActivities] = useState(activitiesExample); // Llista d'activitats

  const handleSave = (updatedActivity) => {
    console.log("Dades actualitzades:", updatedActivity);
    // Actualitza l'activitat a la llista
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === updatedActivity.id ? updatedActivity : activity
      )
    );
  };

  return (
    <div>
      <h2>Selecciona una Activitat</h2>
      <select
        onChange={(e) => {
          const activityId = e.target.value;
          const activity = activities.find((act) => act.id === activityId);
          setSelectedActivity(activity);
        }}
        defaultValue=""
        className="activity-dropdown"
      >
        <option value="" disabled>
          Tria una activitat
        </option>
        {activities.map((activity) => (
          <option key={activity.id} value={activity.id}>
            {activity.name}
          </option>
        ))}
      </select>

      {selectedActivity && (
        <EditActivity
          activity={selectedActivity}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default EditActivityPage;