import React, { useEffect, useState } from "react";
import styled from "styled-components";

function Popular() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const LOGIN_URL = "http://127.0.0.1:8000/api/token/";
  const REFRESH_URL = "http://127.0.0.1:8000/api/token/refresh/";
  const TRIPS_URL = "http://127.0.0.1:8000/api/destinations/";

  const credentials = {
    username: import.meta.env.REACT_APP_API_USERNAME,
    password: import.meta.env.REACT_APP_API_PASSWORD,
  };

  // Login
  const login = async () => {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    return data.access;
  };

  // Refresh token
  const refreshToken = async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) throw new Error("No refresh token found");

    const response = await fetch(REFRESH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) throw new Error("Failed to refresh token");

    const data = await response.json();
    localStorage.setItem("accessToken", data.access);
    return data.access;
  };

  // Fetch trips
  const fetchTrips = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken") || (await login());

      let response = await fetch(TRIPS_URL, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Retry if token expired
      if (response.status === 401) {
        accessToken = await refreshToken();
        response = await fetch(TRIPS_URL, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      if (!response.ok) throw new Error("Failed to fetch trips");

      const data = await response.json();
      setTrips(data.results || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  if (loading) return <p>Loading trips...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <GridContainer>
      {trips.map((trip) => (
        <TripCard key={trip.id}>
          <ImageWrapper>
            <TripImage src={trip.image_url} alt={trip.name} />
          </ImageWrapper>
          <TripTitle>{trip.name}</TripTitle>
        </TripCard>
      ))}
    </GridContainer>
  );
}

export default Popular;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  padding: 16px;
`;

const TripCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  padding: 8px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 8px;
`;

const TripImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TripTitle = styled.h2`
  font-size: 1.125rem; /* text-lg */
  font-weight: 600; /* font-semibold */
  margin-top: 8px;
  text-align: center;
`;
