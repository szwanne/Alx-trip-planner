import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pre-known coordinates (example: Cape Town, South Africa)
  const coordinates = {
    lat: -33.9249,
    lng: 18.4241,
  };

  // Fetch activities from Travel Advisor API
  const fetchActivities = async () => {
    setLoading(true);
    setError(null);

    const url = `https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary?bl_latitude=11.847676&tr_latitude=12.838442&bl_longitude=109.095887&tr_longitude=109.149359&restaurant_tagcategory_standalone=10591&restaurant_tagcategory=10591&limit=5&currency=USD&open_now=false&lunit=km&lang=en_US`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-rapidapi-key": import.meta.env.VITE_API_KEY,
          "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
        },
      });

      const data = await response.json();

      if (data?.data) {
        // Filter out empty/invalid objects
        const filtered = data.data.filter(
          (item) => item.name && item.photo?.images?.medium?.url
        );
        setActivities(filtered);
      } else {
        setActivities([]);
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("Failed to load activities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <Container>
      <Title>Popular Activities</Title>
      {loading && <p>Loading activities...</p>}
      {error && <Error>{error}</Error>}
      {!loading && activities.length === 0 && <p>No activities found.</p>}

      <CardsWrapper>
        {activities.map((activity, index) => (
          <Card key={index}>
            <Image src={activity.photo.images.medium.url} alt={activity.name} />
            <CardTitle>{activity.name}</CardTitle>
            {activity.address && <p>{activity.address}</p>}
          </Card>
        ))}
      </CardsWrapper>
    </Container>
  );
};

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

const Error = styled.p`
  color: red;
`;

export default Activities;
