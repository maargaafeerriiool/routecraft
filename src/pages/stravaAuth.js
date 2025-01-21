// stravaAuth.js
import axios from "axios";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase"; // Ajusta la ruta si hace falta

// Normalmente usarías variables de entorno en vez de ponerlo en duro
const STRAVA_CLIENT_ID = process.env.REACT_APP_STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.REACT_APP_STRAVA_CLIENT_SECRET;

/**
 * Intercambia el "code" (que Strava te manda tras la autorización)
 * por un "access_token" y "refresh_token".
 * Luego lo guarda en Firestore dentro del usuario con ID `userId`.
 */
export async function exchangeCodeForToken(code, userId) {
  try {
    // Petición POST a Strava
    const response = await axios.post("https://www.strava.com/oauth/token", {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    });

    const data = response.data;
    if (data.access_token) {
      // Guardamos tokens en Firestore
      const userRef = doc(db, "users", userId);
      await setDoc(
        userRef,
        {
          strava: {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: data.expires_at, // fecha UNIX de caducidad
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
 * Recupera de Firestore el access_token de Strava para este usuario
 * y, si está expirado, hace un "refresh" antes de devolverlo.
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

    // Si todavía no ha caducado, lo devolvemos tal cual
    if (now < expires_at) {
      return access_token;
    }

    // Si ya está caducado, lo refrescamos con Strava
    const response = await axios.post("https://www.strava.com/oauth/token", {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token,
    });

    const data = response.data;
    if (data.access_token) {
      // Guardar el nuevo token en Firestore
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