import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Link } from "react-router-dom";

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const LOGIN_URL = `${VITE_API_BASE_URL}/api/token/`;
  const REFRESH_URL = `${VITE_API_BASE_URL}/api/token/refresh/`;
  const ACTIVITIES_URL = `${VITE_API_BASE_URL}/api/activity/`;

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
  const fetchActivities = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken") || (await login());

      let response = await fetch(ACTIVITIES_URL, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Retry if token expired
      if (response.status === 401) {
        accessToken = await refreshToken();
        response = await fetch(ACTIVITIES_URL, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      if (!response.ok) throw new Error("Failed to fetch activities");

      const data = await response.json();
      setActivities(data.results || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) return <p>Loading activities...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container>
      <Title>Discover Activities</Title>
      <CardsWrapper>
        <Splide
          options={{
            perPage: 4,
            perMove: 4,
            arrows: false,
            pagination: false,
            drag: "free",
            gap: "15px",
          }}
        >
          {activities.map((item) => (
            <SplideSlide key={item.id}>
              <Card>
                <StyledLink to={"/place/" + item.id}>
                  <ImageWrapper>
                    <Image src={item.image_url} alt={item.name} />
                  </ImageWrapper>
                  <CardTitle>{item.name}</CardTitle>
                </StyledLink>
              </Card>
            </SplideSlide>
          ))}
        </Splide>
      </CardsWrapper>
    </Container>
  );
}

export default Activities;

const ImageWrapper = styled.div`
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 8px;
`;

const CardsWrapper = styled.div`
  max-width: 1000px; /* Adjust for wider carousel */
  margin: 0 auto;
`;

const Card = styled.div`
  width: 100%;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit; /* Ensures text keeps the default color */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const CardTitle = styled.p`
  font-weight: bold;
  padding: 0.5rem;
  color: #223;
  text-decoration: none;
`;
const Title = styled.h2`
  text-align: 0;
  padding-left: 20px;
  margin-bottom: 2rem;
`;

const Container = styled.div`
  padding: 2rem;
  font-family: Arial, sans-serif;
`;
