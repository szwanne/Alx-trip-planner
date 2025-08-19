import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
// import { Splide, SplideSlide } from "@splidejs/react-splide";
// import "@splidejs/react-splide/css";

// Static list of popular locations
const popularCities = [
  { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  // { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
];

function Popular() {
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    getPopular();
  }, []);

  const getPopular = async () => {
    try {
      const results = await Promise.all(
        popularCities.map(async (city) => {
          const delta = 0.05; // ~5km radius
          const bl_latitude = city.lat - delta;
          const tr_latitude = city.lat + delta;
          const bl_longitude = city.lon - delta;
          const tr_longitude = city.lon + delta;

          // geoapify request

          const response = await fetch(
            `https://api.geoapify.com/v2/places?categories=commercial.supermarket&filter=rect:${bl_longitude},${tr_latitude},${tr_longitude},${bl_latitude}&limit=20&apiKey=${
              import.meta.env.VITE_API_KEY
            }`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log(data);

          // Get top 5 supermarkets
          const supermarkets = data.features
            ?.map((item) => ({
              name: item.properties.name,
              address: item.properties.address_line2,
              lat: item.properties.lat,
              lon: item.properties.lon,
            }))
            .slice(0, 5);

          return { city: city.name, supermarkets };
        })
      );

      setPopular(results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Container>
      <Title>Popular Cities Supermarkets</Title>
      {popular.map(({ cityData, index }) => (
        <Section key={index}>
          <CityName>{cityData}</CityName>
          <CardsWrapper>
            {cityData.supermarkets?.map((store, i) => (
              <li key={i}>
                {store.name || "Unnamed"} - {store.address || "No address"}
              </li>
            ))}
          </CardsWrapper>
        </Section>
      ))}
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  padding: 2rem;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  margin-bottom: 3rem;
`;

const CityName = styled.h2`
  margin-bottom: 1rem;
  color: #333;
`;

const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Card = styled.div`
  width: 200px;
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

const Rating = styled.small`
  display: block;
  padding-bottom: 0.5rem;
  color: #777;
`;

export default Popular;
