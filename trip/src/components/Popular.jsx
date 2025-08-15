import React, { useEffect, useState } from "react";

// Static list of popular locations
const popularCities = [
  { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
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
            `https://travel-advisor.p.rapidapi.com/attractions/list-in-boundary?bl_latitude=${bl_latitude}&tr_latitude=${tr_latitude}&bl_longitude=${bl_longitude}&tr_longitude=${tr_longitude}&limit=9&currency=USD&lunit=km&lang=en_US`,
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
    <div>
      <h1>Popular Destinations</h1>
      {popular.map(({ city, attractions }) => (
        <div key={city}>
          <h2>{city}</h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {attractions.map((a) => (
              <div key={a.name} style={{ width: "200px" }}>
                <img
                  src={a.photo || "https://via.placeholder.com/200"}
                  alt={a.name}
                  style={{ width: "100%" }}
                />
                <p>{a.name}</p>
                <small>{a.rating ? `${a.rating} ★` : "No rating"}</small>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Popular;
