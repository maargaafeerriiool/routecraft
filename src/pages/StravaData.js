// src/StravaData.js

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import polyline from "@mapbox/polyline";

import { auth } from "./firebase";
import { exchangeCodeForToken, getValidStravaToken } from "./stravaAuth";
import { GOOGLE_API_KEY } from "./apiKeys";

const StravaData = () => {
  const [searchParams] = useSearchParams();
  const authorizationCode = searchParams.get("code");

  const [athlete, setAthlete] = useState(null);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Funció de debug per veure user
  const debugUser = () => {
    const user = auth.currentUser;
    console.log("===== STRAVA DATA DEBUG =====");
    console.log("auth.currentUser:", user);
    if (user) {
      console.log("user.uid:", user.uid);
      console.log("user.email:", user.email);
    }
    console.log("=============================");
  };

  const fetchStravaData = async (token) => {
    try {
      setLoading(true);
      console.log("fetchStravaData -> Cridem l'API de Strava amb token:", token);

      const athleteResp = await axios.get("https://www.strava.com/api/v3/athlete", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAthlete(athleteResp.data);

      const activitiesResp = await axios.get(
        "https://www.strava.com/api/v3/athlete/activities",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setActivities(activitiesResp.data || []);

      console.log("Atleta:", athleteResp.data);
      console.log("Activitats:", activitiesResp.data);
    } catch (err) {
      console.error("Error fetchStravaData:", err);
      setError("Error carregant dades de Strava.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debugUser(); // Veiem què diu auth.currentUser abans de fer res

    const user = auth.currentUser;
    if (!user) {
      console.log("No hi ha user -> setError(...)");
      setError("Has d'estar identificat a l'app perquè puguem desar el token a Firestore.");
      return;
    }

    // Aquí ja tens user.uid
    (async () => {
      try {
        if (authorizationCode) {
          console.log("Hi ha code -> exchangeCodeForToken...");
          const newToken = await exchangeCodeForToken(authorizationCode, user.uid);
          if (newToken) {
            console.log("Obtingut newToken:", newToken);
            await fetchStravaData(newToken);
          } else {
            setError("No s'ha pogut obtenir l'access_token amb el code.");
          }
        } else {
          console.log("No hi ha code -> getValidStravaToken...");
          const validToken = await getValidStravaToken(user.uid);
          if (validToken) {
            console.log("Obtingut validToken:", validToken);
            await fetchStravaData(validToken);
          } else {
            setError("No hi ha token vàlid, cal iniciar sessió a Strava.");
          }
        }
      } catch (e) {
        console.error(e);
        setError("Error processant el token de Strava.");
      }
    })();
  }, [authorizationCode]);

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
    <div style={{ margin: "1rem" }}>
      <h1>Dades de Strava</h1>
      {loading && <p>Carregant dades...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {athlete && (
        <div>
          <h2>Atleta</h2>
          <p>
            {athlete.firstname} {athlete.lastname}
          </p>
          <p>{athlete.city}, {athlete.country}</p>
        </div>
      )}

      {activities.length > 0 && (
        <div>
          <h2>Activitats</h2>
          {activities.map((act) => {
            const coords =
              act.map && act.map.summary_polyline
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
              const [latRand, lngRand] = coords[randomIndex];
              streetViewUrlRandom = getStreetViewUrl(latRand, lngRand);
            }

            return (
              <div key={act.id} style={{ marginBottom: "1rem" }}>
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
};

export default StravaData;