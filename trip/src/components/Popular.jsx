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

          const response = await fetch(
            `https://travel-advisor.p.rapidapi.com/attractions/list-in-boundary?bl_latitude=${bl_latitude}&tr_latitude=${tr_latitude}&bl_longitude=${bl_longitude}&tr_longitude=${tr_longitude}&limit=5&currency=USD&lunit=km&lang=en_US`,
            {
              method: "GET",
              headers: {
                "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
                "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
              },
            }
          );

          const data = await response.json();

          const attractions = data.data
            ?.filter((item) => item.name)
            .map((item) => ({
              name: item.name,
              location: item.location_string,
              latitude: item.latitude,
              longitude: item.longitude,
              photo: item.photo?.images?.medium?.url,
              rating: item.rating,
              num_reviews: item.num_reviews,
              ranking: item.ranking,
              website: item.website,
            }));

          return { city: city.name, attractions };
        })
      );

      setPopular(results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Container>
      <Title>Popular Destinations</Title>
      {popular.map(({ city, attractions }) => (
        <Section key={city}>
          <CityName>{city}</CityName>
          <CardsWrapper>
            {attractions.map((a) => (
              <Card key={a.name}>
                <Link to={"/place/" + a.id}>
                  <Image
                    src={a.photo || "https://via.placeholder.com/200"}
                    alt={a.name}
                  />
                  <CardTitle>{a.name}</CardTitle>
                  <Rating>
                    {a.rating ? `${a.rating} ★` : "No rating available"}
                  </Rating>
                </Link>
              </Card>
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
