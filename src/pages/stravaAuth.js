// src/utils/stravaAuth.js

import axios from "axios";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase"; 
import { CLIENT_ID, CLIENT_SECRET } from "./apiKeys";

/**
 * Desa en un document de Firestore els tokens obtinguts de Strava.
 * @param {string} userId - L'ID de l'usuari actual (p.ex. user.uid de Firebase)
 * @param {string} accessToken
 * @param {string} refreshToken
 * @param {number} expiresAt - temps en format "Unix timestamp" (segons)
 */
async function saveTokensToFirestore(userId, accessToken, refreshToken, expiresAt) {
  const ref = doc(db, "strava_tokens", userId);
  await setDoc(ref, {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: expiresAt,
    updatedAt: Date.now(),
  });
}

/**
 * Obté de Firestore els tokens d'un usuari donat.
 * @param {string} userId
 * @returns {Promise<{access_token, refresh_token, expires_at} | null>}
 */
async function getTokensFromFirestore(userId) {
  const ref = doc(db, "strava_tokens", userId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.data(); 
}

/**
 * 1) Intercanvia el 'authorizationCode' per un access_token i refresh_token
 * 2) Desa aquests tokens a Firestore
 * @param {string} authorizationCode - ?code=... retornat per Strava
 * @param {string} userId - ID de l'usuari al teu Firebase
 * @returns {Promise<string | null>} Retorna el 'access_token' o null si falla
 */
export async function exchangeCodeForToken(authorizationCode, userId) {
  try {
    const response = await axios.post("https://www.strava.com/api/v3/oauth/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: authorizationCode,
      grant_type: "authorization_code",
    });

    const { access_token, refresh_token, expires_at } = response.data;

    // Desa a Firestore
    await saveTokensToFirestore(userId, access_token, refresh_token, expires_at);

    return access_token;
  } catch (error) {
    console.error("Error obtenint token de Strava:", error);
    return null;
  }
}

/**
 * Retorna un access_token vàlid per a l'usuari 'userId'.
 *  - Llegeix de Firestore
 *  - Si NO hi ha token, retorna null
 *  - Si el token és caducat, fa 'refresh' i actualitza Firestore
 *  - Retorna el 'access_token' vàlid o null si falla
 * @param {string} userId
 * @returns {Promise<string | null>}
 */
export async function getValidStravaToken(userId) {
  const tokens = await getTokensFromFirestore(userId);
  if (!tokens) {
    return null; 
  }

  const { access_token, refresh_token, expires_at } = tokens;
  if (!access_token || !refresh_token || !expires_at) {
    return null;
  }

  // Comprovem si ha caducat (temps en segons)
  const nowInSeconds = Math.floor(Date.now() / 1000);
  if (expires_at > nowInSeconds) {
    // Encara no ha caducat
    return access_token;
  }

  // Si és caducat, fem la crida de refresh
  try {
    const refreshResp = await axios.post("https://www.strava.com/api/v3/oauth/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    });

    const {
      access_token: newAccess,
      refresh_token: newRefresh,
      expires_at: newExpires
    } = refreshResp.data;

    // Desa els nous valors a Firestore
    await saveTokensToFirestore(userId, newAccess, newRefresh, newExpires);

    return newAccess;
  } catch (err) {
    console.error("Error refrescant el token de Strava:", err);
    return null;
  }
}