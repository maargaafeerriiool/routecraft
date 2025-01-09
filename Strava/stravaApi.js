import axios from "axios";

const clientId = "142793";
const clientSecret = "0e6ae7d8e89de04a613228c9e2315019c38c1aad";
const refreshToken = "af365f360888bc9356c6c5512d8e2fa0bb07f860";

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
        console.error("Error al obtener el token de acceso:", error);
    }
};

export const getAthleteData = async (accessToken) => {
    try {
        const response = await axios.get("https://www.strava.com/api/v3/athlete", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener datos del atleta:", error);
    }
};

export const getActivities = async (accessToken) => {
    try {
        const response = await axios.get("https://www.strava.com/api/v3/athlete/activities", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener actividades:", error);
    }
};