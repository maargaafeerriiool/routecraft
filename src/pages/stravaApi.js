// src/stravaApi.js
import axios from "axios";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase"; // Ajusta si cal
import {
  CLIENT_ID,
  CLIENT_SECRET,
} from "./apiKeys";

/**
 * 1) Intercanvia el "code" d'autorització per un "access_token".
 *    Desa a Firestore dins el document de l'usuari (userId).
 */
export async function exchangeCodeForToken(code, userId) {
  try {
    const response = await axios.post("https://www.strava.com/oauth/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    });

    const data = response.data;
    if (data.access_token) {
      // Guardem tokens a Firestore
      const userRef = doc(db, "users", userId);
      await setDoc(
        userRef,
        {
          strava: {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: data.expires_at, // Data UNIX de caducitat
          },
        },
        { merge: true }
      );
      return data.access_token;
    }

    return null;
  } catch (err) {
    console.error("Error en exchangeCodeForToken:", err);
    return null;
  }
}

/**
 * 2) Recupera el token de Strava de Firestore i, si està caducat, el refresca.
 */
export async function getValidStravaToken(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      return null;
    }
    const userData = snapshot.data();
    const stravaData = userData.strava;
    if (!stravaData) {
      return null;
    }

    const { access_token, refresh_token, expires_at } = stravaData;
    const now = Math.floor(Date.now() / 1000);

    // Si no ha caducat, el tornem
    if (now < expires_at) {
      return access_token;
    }

    // Si és caducat, el refresquem
    const response = await axios.post("https://www.strava.com/oauth/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token,
    });

    const data = response.data;
    if (data.access_token) {
      // Guardem el nou token a Firestore
      await setDoc(
        userRef,
        {
          strava: {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: data.expires_at,
          },
        },
        { merge: true }
      );
      return data.access_token;
    }
    return null;
  } catch (err) {
    console.error("Error en getValidStravaToken:", err);
    return null;
  }
}

/**
 * 3) Obté dades de l’atleta
 */
export async function getAthleteData(accessToken) {
  try {
    const response = await axios.get("https://www.strava.com/api/v3/athlete", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtenir dades de l'atleta:", error);
    throw error;
  }
}

/**
 * 4) Obté la llista d’activitats
 */
export async function getActivities(accessToken) {
  try {
    const response = await axios.get(
      "https://www.strava.com/api/v3/athlete/activities",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtenir activitats:", error);
    throw error;
  }
}