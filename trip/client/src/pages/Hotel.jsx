import { useEffect, useState } from "react";
import styled from "styled-components";

function Hotel() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const LOGIN_URL = `${API_BASE_URL}/token/`;
  const REFRESH_URL = `${API_BASE_URL}/token/refresh/`;
  const HOTEL_URL = `${API_BASE_URL}/hotels/`;

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

  // ---- Fetch Hotels ----
  const fetchHotels = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken") || (await login());

      let response = await fetch(HOTEL_URL, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 401) {
        accessToken = await refreshToken();
        response = await fetch(HOTEL_URL, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      if (!response.ok) throw new Error("Failed to fetch hotels");

      const data = await response.json();
      setHotels(data.results || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  if (loading) return <p>Loading hotels...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!hotels.length) return <p>No hotels found.</p>;

  return (
    <Container>
      <Title>Available Hotels</Title>
      <GridContainer>
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id}>
            <ImageWrapper>
              <HotelImage src={hotel.image_url} alt={hotel.name} />
            </ImageWrapper>
            <HotelDetails>
              <HotelName>{hotel.name}</HotelName>
              <HotelLocation>{hotel.location}</HotelLocation>
              <HotelPrice>${hotel.price_per_night} / night</HotelPrice>
              <HotelRating>⭐ {hotel.rating.toFixed(1)}</HotelRating>
            </HotelDetails>
          </HotelCard>
        ))}
      </GridContainer>
    </Container>
  );
}

export default Hotel;

// ------------------ STYLES ------------------
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 16px;
`;

const HotelCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  overflow: hidden;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 180px;
  overflow: hidden;
`;

const HotelImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HotelDetails = styled.div`
  padding: 12px;
`;

const HotelName = styled.h3`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 6px;
`;

const HotelLocation = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 6px;
`;

const HotelPrice = styled.p`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 6px;
`;

const HotelRating = styled.p`
  font-size: 0.9rem;
  color: #ff9800;
`;

const Title = styled.h2`
  padding-left: 20px;
  margin-bottom: 1.5rem;
`;

const Container = styled.div`
  padding: 2rem;
  font-family: Arial, sans-serif;
`;
