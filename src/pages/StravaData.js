import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import polyline from "@mapbox/polyline";
import "./stravaData.css";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  exchangeCodeForToken,
  getValidStravaToken,
  getAthleteData,
  getActivities,
} from "./stravaApi";
import { GOOGLE_API_KEY } from "./apiKeys";

// Helpers
const formatDistance = (meters) => (meters / 1000).toFixed(2); // Metres a quilòmetres
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
};
const decodePolyline = (poly) => {
  try {
    return polyline.decode(poly);
  } catch {
    return [];
  }
};
const getStreetViewUrl = (lat, lng) => 
  `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&key=${GOOGLE_API_KEY}`;

// Components
const Activity = ({ activity }) => {
  const coords = activity.map?.summary_polyline
    ? decodePolyline(activity.map.summary_polyline)
    : [];
  const streetViewUrlStart = coords[0]
    ? getStreetViewUrl(coords[0][0], coords[0][1])
    : null;
  const streetViewUrlEnd = coords[coords.length - 1]
    ? getStreetViewUrl(coords[coords.length - 1][0], coords[coords.length - 1][1])
    : null;

  return (
    <div className="activity-block">
      <div className="activity-details">
        <h3>{activity.name}</h3>
        <h6>🏃 Distància: {formatDistance(activity.distance)} km</h6>
        <h6>⏱️ Temps: {formatTime(activity.moving_time)}</h6>
      </div>
      <div className="activity-images">
        {streetViewUrlStart && (
          <div className="image-container">
            <img src={streetViewUrlStart} alt="Street View Inici" />
            <div className="image-label">Inici</div>
          </div>
        )}
        {streetViewUrlEnd && (
          <div className="image-container">
            <img src={streetViewUrlEnd} alt="Street View Final" />
            <div className="image-label">Final</div>
          </div>
        )}
      </div>
    </div>
  );
};

// Component principal
const StravaData = () => {
  const [searchParams] = useSearchParams();
  const authorizationCode = searchParams.get("code");

  const [athlete, setAthlete] = useState(null);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  const fetchStravaData = async (token) => {
    try {
      setLoading(true);
      const athleteData = await getAthleteData(token);
      const activitiesData = await getActivities(token);
      setAthlete(athleteData);
      setActivities(activitiesData || []);
    } catch (err) {
      console.error("Error fetchStravaData:", err);
      setError("Error carregant dades de Strava.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser === undefined) return;
    if (currentUser === null) {
      setError("Has d'estar identificat a l'app per desar el token a Firestore.");
      return;
    }

    (async () => {
      try {
        if (authorizationCode) {
          const newToken = await exchangeCodeForToken(authorizationCode, currentUser.uid);
          if (newToken) await fetchStravaData(newToken);
          else setError("");
        } else {
          const validToken = await getValidStravaToken(currentUser.uid);
          if (validToken) await fetchStravaData(validToken);
          else setError("No hi ha token vàlid, cal iniciar sessió a Strava.");
        }
      } catch (e) {
        console.error("Error processant token de Strava:", e);
        setError("Error processant el token de Strava.");
      }
    })();
  }, [authorizationCode, currentUser]);

  return (
    <div className="strava-container">
      <h1 className="logo">ROUTECRAFT</h1>
      {loading && <p>Carregant dades...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {athlete && (
        <div>
          <h2>ATLETA</h2>
          <h4> Nom:</h4><p>{athlete.firstname} {athlete.lastname}</p>
          <h7> País:{athlete.city} {athlete.country}</h7>
        </div>
      )}

      {activities.length > 0 && (
        <div>
          <h2>ACTIVITATS</h2>
          {activities.map((activity) => (
            <Activity key={activity.id} activity={activity} />
          ))}
        </div>
      )}

      {!loading && !athlete && !activities.length && !error && (
        <p>No hi ha dades. Potser cal connectar-se a Strava.</p>
      )}

      <button
        onClick={() => navigate(`/edit-activity`)}
        className="edit-button"
      >
        EDITAR ACTIVITAT
      </button>
    </div>
  );
};

export default StravaData;