import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import polyline from "@mapbox/polyline";
import "./stravaData.css";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

// ⬇️ Importem TOTES les funcions directament des de stravaApi:
import {
  exchangeCodeForToken,
  getValidStravaToken,
  getAthleteData,
  getActivities,
} from "./stravaApi";

import { GOOGLE_API_KEY } from "./apiKeys";

function StravaData() {
  const [searchParams] = useSearchParams();
  const authorizationCode = searchParams.get("code");

  const [athlete, setAthlete] = useState(null);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Control d’usuari (Firebase)
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  const fetchStravaData = async (token) => {
    try {
      setLoading(true);
      console.log("fetchStravaData -> token:", token);

      // Obtenim dades de l’atleta
      const athleteData = await getAthleteData(token);
      setAthlete(athleteData);

      // Obtenim activitats
      const activitiesData = await getActivities(token);
      setActivities(activitiesData || []);

      console.log("Atleta:", athleteData);
      console.log("Activitats:", activitiesData);
    } catch (err) {
      console.error("Error fetchStravaData:", err);
      setError("Error carregant dades de Strava.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Esperem a saber si hi ha user (null o objecte).
    if (currentUser === undefined) return;

    if (currentUser === null) {
      // Sense usuari loguejat no podem desar token a Firestore
      setError("Has d'estar identificat a l'app per desar el token a Firestore.");
      return;
    }

    (async () => {
      try {
        if (authorizationCode) {
          console.log("Hi ha code -> exchangeCodeForToken...");
          const newToken = await exchangeCodeForToken(authorizationCode, currentUser.uid);
          if (newToken) {
            console.log("Obtingut newToken:", newToken);
            await fetchStravaData(newToken);
          } else {
            console.log("No s'ha pogut obtenir l'access_token amb el code.");
            setError("No s'ha pogut obtenir l'access_token amb el code.");
          }
        } else {
          console.log("No hi ha code -> getValidStravaToken...");
          const validToken = await getValidStravaToken(currentUser.uid);
          if (validToken) {
            console.log("Obtingut validToken:", validToken);
            await fetchStravaData(validToken);
          } else {
            setError("No hi ha token vàlid, cal iniciar sessió a Strava.");
          }
        }
      } catch (e) {
        console.error("Error processant token de Strava:", e);
        setError("Error processant el token de Strava.");
      }
    })();
  }, [authorizationCode, currentUser]);

  // Helpers per decodificar polilínies
  const decodePolyline = (poly) => {
    try {
      return polyline.decode(poly);
    } catch {
      return [];
    }
  };

  const getStreetViewUrl = (lat, lng) => {
    return `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&key=${GOOGLE_API_KEY}`;
  };

  return (
    <div className="strava-container">
      <h1>Dades de Strava</h1>

      {loading && <p>Carregant dades...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {athlete && (
        <div>
          <h2>Atleta</h2>
          <p>
            {athlete.firstname} {athlete.lastname}
          </p>
          <p>
            {athlete.city}, {athlete.country}
          </p>
        </div>
      )}

      {activities.length > 0 && (
        <div>
          <h2>Activitats</h2>
          {activities.map((act) => {
            const coords = act.map?.summary_polyline
              ? decodePolyline(act.map.summary_polyline)
              : [];

            let streetViewUrlStart = "";
            let streetViewUrlEnd = "";
            let streetViewUrlRandom = "";

            if (coords.length > 0) {
              const [startLat, startLng] = coords[0];
              streetViewUrlStart = getStreetViewUrl(startLat, startLng);
            }
            if (coords.length > 1) {
              const [endLat, endLng] = coords[coords.length - 1];
              streetViewUrlEnd = getStreetViewUrl(endLat, endLng);
            }
            if (coords.length > 2) {
              const randomIndex = Math.floor(Math.random() * coords.length);
              const [randLat, randLng] = coords[randomIndex];
              streetViewUrlRandom = getStreetViewUrl(randLat, randLng);
            }

            return (
              <div key={act.id} className="activity-block">
                <h3>{act.name}</h3>
                <p>Distància: {act.distance} m</p>
                <p>Temps: {act.moving_time} s</p>

                {streetViewUrlStart && (
                  <div>
                    <strong>Inici</strong>
                    <img
                      src={streetViewUrlStart}
                      alt="Street View Inici"
                      width={600}
                      height={300}
                    />
                  </div>
                )}

                {streetViewUrlEnd && (
                  <div>
                    <strong>Final</strong>
                    <img
                      src={streetViewUrlEnd}
                      alt="Street View Final"
                      width={600}
                      height={300}
                    />
                  </div>
                )}

                {streetViewUrlRandom && (
                  <div>
                    <strong>Punt aleatori</strong>
                    <img
                      src={streetViewUrlRandom}
                      alt="Street View Aleatori"
                      width={600}
                      height={300}
                    />
                  </div>
                )}

                <hr />
              </div>
            );
          })}
        </div>
      )}

      {!loading && !athlete && !activities.length && !error && (
        <p>No hi ha dades. Potser cal connectar-se a Strava.</p>
      )}
    </div>
  );
}

export default StravaData;