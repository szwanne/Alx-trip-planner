import { useEffect, useState } from "react";
import styled from "styled-components";

function Flight() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const LOGIN_URL = "http://127.0.0.1:8000/api/token/";
  const REFRESH_URL = "http://127.0.0.1:8000/api/token/refresh/";
  const FLIGHTS_URL = "http://127.0.0.1:8000/api/flightoffers/";

  const credentials = {
    username: import.meta.env.VITE_API_USERNAME,
    password: import.meta.env.VITE_API_PASSWORD,
  };

  // ---- Login ----
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

  // ---- Refresh ----
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

  // ---- Fetch Flights ----
  const fetchFlights = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken") || (await login());

      let response = await fetch(FLIGHTS_URL, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 401) {
        accessToken = await refreshToken();
        response = await fetch(FLIGHTS_URL, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      if (!response.ok) throw new Error("Failed to fetch flights");

      const data = await response.json();
      setFlights(data.results || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  if (loading) return <p>Loading flights...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!flights.length) return <p>No flights available.</p>;

  return (
    <Container>
      <Title>Available Flights</Title>
      <Grid>
        {flights.map((flight) => (
          <FlightCard key={flight.id}>
            <Airline>{flight.airline}</Airline>
            <p>
              <strong>Flight:</strong> {flight.flight_number}
            </p>
            <p>
              <strong>From:</strong> {flight.departure_airport}
            </p>
            <p>
              <strong>To:</strong> {flight.arrival_airport}
            </p>
            <p>
              <strong>Departure:</strong>{" "}
              {new Date(flight.departure_time).toLocaleString()}
            </p>
            <p>
              <strong>Arrival:</strong>{" "}
              {new Date(flight.arrival_time).toLocaleString()}
            </p>
            <p>
              <strong>Cabin:</strong> {flight.cabin_class}
            </p>
            <Price>${parseFloat(flight.price).toFixed(2)}</Price>
          </FlightCard>
        ))}
      </Grid>
    </Container>
  );
}

export default Flight;

// ------------------ STYLES ------------------
const Container = styled.div`
  padding: 2rem;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const FlightCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 16px;
  background-color: #fff;
`;

const Airline = styled.h3`
  margin-bottom: 8px;
  color: #1a365d;
`;

const Price = styled.p`
  margin-top: 12px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #2b6cb0;
`;
