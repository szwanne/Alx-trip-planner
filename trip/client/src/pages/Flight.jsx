import { useEffect, useState } from "react";
import styled from "styled-components";

function Flight() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const LOGIN_URL = `${API_BASE_URL}/token/`;
  const REFRESH_URL = `${API_BASE_URL}/token/refresh/`;
  const FLIGHTS_URL = `${API_BASE_URLS}/flightoffers/`;

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
      <List>
        {flights.map((flight) => (
          <FlightCard key={flight.id}>
            <TopRow>
              <Airline>{flight.airline}</Airline>
              <Price>${parseFloat(flight.price).toFixed(2)}</Price>
            </TopRow>

            <FlightNumber>✈️ {flight.flight_number}</FlightNumber>

            <Route>
              <Location>
                <strong>{flight.departure_airport}</strong>
                <small>
                  {new Date(flight.departure_time).toLocaleString()}
                </small>
              </Location>
              <Dash>➝</Dash>
              <Location>
                <strong>{flight.arrival_airport}</strong>
                <small>{new Date(flight.arrival_time).toLocaleString()}</small>
              </Location>
            </Route>

            <CabinTag>{flight.cabin_class}</CabinTag>
          </FlightCard>
        ))}
      </List>
    </Container>
  );
}

export default Flight;

/* ---------- STYLES ---------- */
const Container = styled.div`
  padding: 2rem;
  font-family: "Inter", Arial, sans-serif;
  background: #f9fafb;
  min-height: 100vh;
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;
  color: #1a202c;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FlightCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Airline = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
`;

const Price = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #3182ce;
`;

const FlightNumber = styled.p`
  font-size: 0.95rem;
  color: #4a5568;
  margin-bottom: 12px;
`;

const Route = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Location = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;

  strong {
    font-size: 1rem;
    color: #1a202c;
  }

  small {
    color: #718096;
    font-size: 0.8rem;
  }
`;

const Dash = styled.span`
  font-size: 1.5rem;
  color: #a0aec0;
`;

const CabinTag = styled.span`
  display: inline-block;
  background: #ebf8ff;
  color: #2b6cb0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;
