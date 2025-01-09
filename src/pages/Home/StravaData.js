import { useState, useEffect } from "react";
import { getAccessToken, getAthleteData, getActivities } from "../../stravaApi";

const StravaData = () => {
    const [athlete, setAthlete] = useState(null);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = await getAccessToken();
            const athleteData = await getAthleteData(token);
            const activitiesData = await getActivities(token);

            setAthlete(athleteData);
            setActivities(activitiesData);
        };

        fetchData();
    }, []);

    return (
        <div>
            {athlete ? (
                <div>
                    <h2>Datos del Usuario</h2>
                    <p>Nombre: {athlete.firstname} {athlete.lastname}</p>
                    <p>Ciudad: {athlete.city}</p>
                    <p>País: {athlete.country}</p>
                </div>
            ) : (
                <p>Cargando datos del usuario...</p>
            )}
            <div>
                <h2>Actividades</h2>
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <div key={activity.id}>
                            <h3>{activity.name}</h3>
                            <p>Distancia: {activity.distance} m</p>
                            <p>Tiempo: {activity.moving_time} s</p>
                        </div>
                    ))
                ) : (
                    <p>Cargando actividades...</p>
                )}
            </div>
        </div>
    );
};

export default StravaData;