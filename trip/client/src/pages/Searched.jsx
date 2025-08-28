import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

function Searched() {
  const [searchedTrips, setSearchedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { search } = useParams();

  const LOGIN_URL = "http://127.0.0.1:8000/api/token/";
  const REFRESH_URL = "http://127.0.0.1:8000/api/token/refresh/";
  const SEARCH_URL = "http://127.0.0.1:8000/api/destinations/?search=";

  const credentials = {
    username: import.meta.env.VITE_API_USERNAME,
    password: import.meta.env.VITE_API_PASSWORD,
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

  // Fetch search results
  const fetchSearchResults = async (query) => {
    try {
      setLoading(true);
      let accessToken = localStorage.getItem("accessToken") || (await login());

      let response = await fetch(`${SEARCH_URL}${query}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Retry if token expired
      if (response.status === 401) {
        accessToken = await refreshToken();
        response = await fetch(`${SEARCH_URL}${query}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      if (!response.ok) throw new Error("Failed to fetch trips");

      const data = await response.json();
      setSearchedTrips(data.results || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search) {
      fetchSearchResults(search);
    }
  }, [search]);

  if (loading) return <p>Loading search results...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container>
      <Title>Search results for "{search}"</Title>
      {searchedTrips.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <Grid>
          {searchedTrips.map((item) => (
            <Card key={item.id}>
              <ImageWrapper>
                <Image src={item.image_url} alt={item.title} />
              </ImageWrapper>
              <CardTitle>{item.name}</CardTitle>
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Searched;

// ---------- STYLES ----------

const Container = styled.div`
  padding: 2rem;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  color: #222;
  font-size: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.15);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 160px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardTitle = styled.p`
  font-weight: bold;
  padding: 0.75rem;
  color: #333;
  font-size: 1.5rem;
`;
