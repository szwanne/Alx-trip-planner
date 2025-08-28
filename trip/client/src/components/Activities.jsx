import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const LOGIN_URL = "http://127.0.0.1:8000/api/token/";
  const REFRESH_URL = "http://127.0.0.1:8000/api/token/refresh/";
  const ACTIVITIES_URL = "http://127.0.0.1:8000/api/activity/";

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
              <ImageWrapper>
                <Image src={item.image_url} alt={item.name} />
              </ImageWrapper>
              <CardTitle>{item.name}</CardTitle>
            </Card>
          </SplideSlide>
        ))}
      </Splide>
    </CardsWrapper>
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
`;

const Image = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const CardTitle = styled.p`
  font-weight: bold;
  padding: 0.5rem;
  color: #222;
`;
