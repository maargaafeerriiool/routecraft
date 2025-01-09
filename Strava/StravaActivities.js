import React, { useState } from 'react';
import StravaApiV3 from 'strava_api_v3';

const StravaActivities = () => {
  const [activities, setActivities] = useState(null);
  const [error, setError] = useState(null);

  const fetchActivities = () => {
    // Set up the Strava API client
    const defaultClient = StravaApiV3.ApiClient.instance;

    // Configure OAuth2 access token
    const strava_oauth = defaultClient.authentications['strava_oauth'];
    strava_oauth.accessToken = 'YOUR_ACCESS_TOKEN'; // Replace with your actual access token

    const api = new StravaApiV3.ActivitiesApi();

    const opts = {
      before: Math.floor(Date.now() / 1000), // Example: Current timestamp
      after: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 7, // Example: 7 days ago
      page: 1,
      perPage: 10, // Number of activities to fetch per page
    };

    api.getLoggedInAthleteActivities(opts, (error, data, response) => {
      if (error) {
        console.error('Error fetching activities:', error);
        setError(error);
      } else {
        console.log('API called successfully. Returned data:', data);
        setActivities(data);
      }
    });
  };

  return (
    <div>
      <h1>Strava Activities Fetcher</h1>
      <button onClick={fetchActivities}>Fetch Activities</button>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {activities && activities.length > 0 ? (
        <ul>
          {activities.map((activity, index) => (
            <li key={index}>
              <strong>{activity.name}</strong> - {activity.distance} meters
            </li>
          ))}
        </ul>
      ) : (
        activities && <p>No activities found.</p>
      )}
    </div>
  );
};

export default StravaActivities;