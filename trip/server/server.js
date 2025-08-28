import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());

const AMADEUS_AUTH_URL =
  "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_DEST_URL =
  "https://test.api.amadeus.com/v1/shopping/flight-destinations";

let token = null;
let tokenExpiry = null;

// 🔹 Function to fetch new token
async function getToken() {
  if (token && tokenExpiry && Date.now() < tokenExpiry) {
    return token;
  }

  const response = await fetch(AMADEUS_AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_CLIENT_ID,
      client_secret: process.env.AMADEUS_CLIENT_SECRET,
    }),
  });

  const data = await response.json();
  token = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000; // save expiry time
  return token;
}

// 🔹 API route for destinations
app.get("/api/popular-destinations", async (req, res) => {
  try {
    const accessToken = await getToken();

    const response = await fetch(`${AMADEUS_DEST_URL}?origin=PAR`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});

app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);
