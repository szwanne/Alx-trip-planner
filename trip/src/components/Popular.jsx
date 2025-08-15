import React, { useEffect } from "react";

function Popular() {
  useEffect(() => {
    getPopular();
  }, []);

  const getPopular = async () => {
    try {
      const response = await fetch(
        "https://travel-advisor.p.rapidapi.com/attractions/list-in-boundary?bl_latitude=34.0522&tr_latitude=34.0522&bl_longitude=-118.2437&tr_longitude=-118.2437&limit=9&currency=USD&lunit=km&lang=en_US",
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return <div>Popular</div>;
}

export default Popular;
