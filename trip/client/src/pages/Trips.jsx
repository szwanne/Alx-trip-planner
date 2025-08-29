import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const LOGIN_URL = "http://127.0.0.1:8000/api/token/";
  const REFRESH_URL = "http://127.0.0.1:8000/api/token/refresh/";
  const DESTINATION_URL = "http://127.0.0.1:8000/api/activity/";

  const credentials = {
    username: import.meta.env.REACT_APP_API_USERNAME,
    password: import.meta.env.REACT_APP_API_PASSWORD,
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

  // ---- Fetch All Destinations ----
  const fetchDestinations = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken") || (await login());

      let response = await fetch(DESTINATION_URL, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // retry if token expired
      if (response.status === 401) {
        accessToken = await refreshToken();
        response = await fetch(DESTINATION_URL, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      if (!response.ok) throw new Error("Failed to fetch destinations");

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
    fetchDestinations();
  }, []);

  if (loading) return <p>Loading trips...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!trips.length) return <p>No trips found.</p>;

  return (
    <Container>
      <Title>Explore All Trips</Title>
      <GridContainer>
        {trips.map((trip) => (
          <TripCard key={trip.id}>
            <StyledLink to={"/place/" + trip.id}>
              <ImageWrapper>
                <TripImage src={trip.image_url} alt={trip.name} />
              </ImageWrapper>
              <TripTitle>{trip.name}</TripTitle>
            </StyledLink>
          </TripCard>
        ))}
      </GridContainer>
    </Container>
  );
}

export default Trips;

// ------------------ STYLES ------------------
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
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
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
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 8px;
  text-align: center;
`;

const Title = styled.h2`
  padding-left: 20px;
  margin-bottom: 2rem;
`;

const Container = styled.div`
  padding: 2rem;
  font-family: Arial, sans-serif;
`;
