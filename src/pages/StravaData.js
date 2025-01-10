import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import polyline from "@mapbox/polyline"; // Decodificador de polylines

// Credencials de la teva app
const CLIENT_ID = "142793";
const CLIENT_SECRET = "0e6ae7d8e89de04a613228c9e2315019c38c1aad";

// La teva Google Maps API key (Street View)
const GOOGLE_API_KEY = "AIzaSyAPMJ2MkgSTRK8USKRv3FT6gsKzMbOj_zk";

const StravaData = () => {
  const [searchParams] = useSearchParams();
  const authorizationCode = searchParams.get("code");

  const [athlete, setAthlete] = useState(null);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");
  const [loadingToken, setLoadingToken] = useState(false);

  useEffect(() => {
    // Si veiem que hi ha un 'code' a l'URL, fem l'intercanvi per obtenir el token
    const fetchTokenAndData = async () => {
      if (!authorizationCode) return; // si no hi ha code, no fem res

      setLoadingToken(true);

      try {
        // 1) Intercanviar el code per obtenir el token
        const tokenResponse = await axios.post(
          "https://www.strava.com/api/v3/oauth/token",
          {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: authorizationCode,
            grant_type: "authorization_code",
          }
        );

        const { access_token } = tokenResponse.data;
        localStorage.setItem("strava_access_token", access_token);

        // 2) Demanar dades de l’atleta
        const athleteResponse = await axios.get(
          "https://www.strava.com/api/v3/athlete",
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setAthlete(athleteResponse.data);

        // 3) Demanar llista d’activitats
        const activitiesResponse = await axios.get(
          "https://www.strava.com/api/v3/athlete/activities",
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setActivities(activitiesResponse.data || []);
      } catch (err) {
        console.error(err);
        setError("Error intercanviant codi o carregant dades");
      } finally {
        setLoadingToken(false);
      }
    };

    fetchTokenAndData();
  }, [authorizationCode]);

  // Funció auxiliar per obtenir la imatge de Street View d’una coordenada
  const getStreetViewUrl = (lat, lng) => {
    return `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&key=${GOOGLE_API_KEY}`;
  };

  // Funció per decodificar un summary_polyline a una llista de coordenades [lat, lng]
  const decodePolyline = (summaryPolyline) => {
    try {
      return polyline.decode(summaryPolyline);
    } catch (error) {
      console.error("Error decodificant polyline:", error);
      return [];
    }
  };

  return (
    <div style={{ margin: "1rem" }}>
      <h1>Dades de Strava</h1>

      {!authorizationCode && (
        <p>
          No s'ha rebut cap code. Si us plau, inicia la sessió i connecta amb
          Strava.
        </p>
      )}

      {loadingToken && <p>Carregant token i dades de l'usuari...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {athlete && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Atleta</h2>
          <p>
            Nom: {athlete.firstname} {athlete.lastname}
          </p>
          <p>Ciutat: {athlete.city}</p>
          <p>País: {athlete.country}</p>
        </div>
      )}

      {activities.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Activitats</h2>
          {activities.map((activity) => {
            // Decodifiquem la polyline
            const coords =
              activity.map && activity.map.summary_polyline
                ? decodePolyline(activity.map.summary_polyline)
                : [];

            // Només si tenim coordenades
            let streetViewUrlStart = "";
            let streetViewUrlEnd = "";
            let streetViewUrlRandom = "";

            if (coords.length > 0) {
              // Posició inicial
              const [startLat, startLng] = coords[0];
              streetViewUrlStart = getStreetViewUrl(startLat, startLng);
            }

            if (coords.length > 1) {
              // Posició final
              const [endLat, endLng] = coords[coords.length - 1];
              streetViewUrlEnd = getStreetViewUrl(endLat, endLng);
            }

            if (coords.length > 2) {
              // Posició aleatòria
              const randomIndex = Math.floor(Math.random() * coords.length);
              const [randLat, randLng] = coords[randomIndex];
              streetViewUrlRandom = getStreetViewUrl(randLat, randLng);
            }

            return (
              <div key={activity.id} style={{ marginBottom: "2rem" }}>
                <h3>{activity.name}</h3>
                <p>Distància: {activity.distance} m</p>
                <p>Temps: {activity.moving_time} s</p>

                {coords.length === 0 && (
                  <p>No s'ha trobat cap polyline o no s'ha pogut decodificar.</p>
                )}

                {/* Posició inicial */}
                {streetViewUrlStart && (
                  <div>
                    <h4>Posició inicial aproximada</h4>
                    <img
                      src={streetViewUrlStart}
                      alt="Street View d'inici"
                      style={{ width: "600px", height: "300px" }}
                    />
                  </div>
                )}

                {/* Posició final */}
                {streetViewUrlEnd && (
                  <div>
                    <h4>Posició final aproximada</h4>
                    <img
                      src={streetViewUrlEnd}
                      alt="Street View final"
                      style={{ width: "600px", height: "300px" }}
                    />
                  </div>
                )}

                {/* Posició aleatòria */}
                {streetViewUrlRandom && (
                  <div>
                    <h4>Posició aleatòria</h4>
                    <img
                      src={streetViewUrlRandom}
                      alt="Street View aleatòria"
                      style={{ width: "600px", height: "300px" }}
                    />
                  </div>
                )}

                <hr />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StravaData;