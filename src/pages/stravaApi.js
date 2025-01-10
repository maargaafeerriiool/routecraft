import axios from "axios";

// Credencials de la teva aplicació Strava
const clientId = "142793";
const clientSecret = "0e6ae7d8e89de04a613228c9e2315019c38c1aad";
const refreshToken = "af365f360888bc9356c6c5512d8e2fa0bb07f860";

// Sol·licitar un nou access token utilitzant el refresh token
export const getAccessToken = async () => {
    try {
        const response = await axios.post("https://www.strava.com/api/v3/oauth/token", {
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: "refresh_token",
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Error al obtenir el token d'accés:", error);
        throw error;
    }
};

// Obtenir les dades de l'usuari
export const getAthleteData = async (accessToken) => {
    try {
        const response = await axios.get("https://www.strava.com/api/v3/athlete", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtenir dades de l'atleta:", error);
        throw error;
    }
};

// Obtenir les activitats de l'usuari
export const getActivities = async (accessToken) => {
    try {
        const response = await axios.get("https://www.strava.com/api/v3/athlete/activities", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtenir activitats:", error);
        throw error;
    }
};