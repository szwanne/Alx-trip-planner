import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

function Place() {
  const { id } = useParams(); // /place/:id
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bookingDate, setBookingDate] = useState("");
  const [cost] = useState(250); // mock cost

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const LOGIN_URL = `${API_BASE_URL}/token/`;
  const REFRESH_URL = `${API_BASE_URL}/token/refresh/`;
  const DESTINATION_URL = `${API_BASE_URL}/destinations/`;

  const credentials = {
    username: import.meta.env.VITE_API_USERNAME,
    password: import.meta.env.VITE_API_PASSWORD,
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

  // ---- Fetch Place ----
  const fetchPlace = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken") || (await login());

      let response = await fetch(`${DESTINATION_URL}${id}/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // retry if expired
      if (response.status === 401) {
        accessToken = await refreshToken();
        response = await fetch(`${DESTINATION_URL}${id}/`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      if (!response.ok) throw new Error("Failed to fetch place details");

      const data = await response.json();
      setDetails(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPlace();
  }, [id]);

  if (loading) return <p>Loading place details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!details) return <p>No details found.</p>;

  return (
    <Container>
      <ImageWrapper>
        <HeroImage src={details.image_url} alt={details.name} />
        <Title>{details.name}</Title>
      </ImageWrapper>

      <Content>
        <Description>{details.description}</Description>
        <InfoRow>
          <span>
            <strong>Country:</strong> {details.country}
          </span>
          <span>
            <strong>Estimated Cost:</strong> ${cost}
          </span>
        </InfoRow>

        <BookingSection>
          <label>Select Date:</label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
          />
          <Button>Reserve Now</Button>
          <Button secondary>Add Trip Members</Button>
        </BookingSection>

        <Section>
          <h3>Activities</h3>
          <ActivitiesGrid>
            {details.activities.map((act) => (
              <ActivityCard key={act.id}>
                <img src={act.image_url} alt={act.name} />
                <h4>{act.name}</h4>
                <p>{act.description}</p>
                <small>{new Date(act.date).toDateString()}</small>
              </ActivityCard>
            ))}
          </ActivitiesGrid>
        </Section>

        <Section>
          <h3>Weather</h3>
          <WeatherBox>
            <p>🌤️ 24°C, Clear Skies</p>
            <small>Sample weather data</small>
          </WeatherBox>
        </Section>
      </Content>
    </Container>
  );
}

export default Place;

/* ---------- Styles ---------- */

const Container = styled.div`
  font-family: Arial, sans-serif;
  padding-bottom: 2rem;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(70%);
`;

const Title = styled.h1`
  position: absolute;
  bottom: 20px;
  left: 30px;
  color: white;
  font-size: 2rem;
  text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);
`;

const Content = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #444;
`;

const InfoRow = styled.div`
  margin: 1.5rem 0;
  display: flex;
  justify-content: space-between;
  color: #222;
  font-size: 1rem;
`;

const BookingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  input[type="date"] {
    padding: 0.4rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
`;

const Button = styled.button`
  background: ${(props) => (props.secondary ? "#eee" : "#0077ff")};
  color: ${(props) => (props.secondary ? "#222" : "white")};
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: ${(props) => (props.secondary ? "#ddd" : "#005fcc")};
  }
`;

const Section = styled.section`
  margin-top: 2rem;
  h3 {
    margin-bottom: 1rem;
    color: #222;
  }
`;

const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const ActivityCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;

  img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 0.5rem;
  }

  h4 {
    margin: 0.5rem 0;
    color: #333;
  }

  p {
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 0.5rem;
  }

  small {
    color: #777;
  }
`;

const WeatherBox = styled.div`
  background: #f0f8ff;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1.1rem;
`;
