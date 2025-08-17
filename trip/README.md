# 🌍 Travel Planner Application

## 📌 Overview

The **Travel Planner Application** is a frontend project built with **React, JavaScript, HTML, and CSS**.  
It allows users to search for destinations, view detailed travel information, and plan trips by creating personalized itineraries.

This project integrates with the **Amadeus API** (and optionally OpenWeatherMap & Teleport APIs) to fetch real-world travel data such as destinations, flights, hotels, and attractions.

For styling, the application uses **Styled Components**, ensuring a modular and maintainable UI.

---

## 🚀 Features

### 🔎 Destination Search

- Search destinations by city or keyword.
- Displays a list of matching destinations with:
  - **City Name**
  - **Country**
  - **Image** (via Teleport API or custom images)
  - **Top Attractions**

### 🏙️ Destination Details View

When a user clicks on a destination, a detailed page shows:

- Popular attractions & activities.
- **Flight offers** (Amadeus Flight Offers API).
- **Hotel accommodations** (Amadeus Hotel Search API).
- **Weather forecast** (OpenWeatherMap API – optional).

### 📅 Itinerary Planner

- Create, save, and manage travel itineraries.
- Add destinations, flights, and accommodations.
- Specify dates and times for activities.

### 🔍 Search Functionality

- Search destinations by name or keywords (e.g., "Paris", "beach vacation").
- Graceful handling of no results with user-friendly messages.

### 📱 Responsive UI

- Fully responsive design using **Styled Components**.
- Works seamlessly on **desktop, tablet, and mobile**.

### ⚠️ Error Handling

- Handles API/network errors gracefully.
- Displays fallback messages when data is unavailable.

---

## 🛠️ Technical Requirements

### Project Setup

- React project setup with **Vite** or CRA.
- Styling with **Styled Components**.

### API Integration

- [Amadeus API](https://developers.amadeus.com/) (required).
- [OpenWeatherMap API](https://openweathermap.org/api) (optional).
- [Teleport API](https://developers.teleport.org/) (optional for city images/info).

### Components

- `SearchBar` – search input.
- `DestinationCard` – preview of each destination.
- `ItineraryPlanner` – itinerary management UI.

### State Management

- React hooks: `useState`, `useEffect`.
- Optional: Redux, Zustand, or MST for complex state.

### Deployment

- Deploy on **Netlify** or **Vercel**.
- Ensure accessibility and performance optimization.

---

## 🔗 API Endpoints (Examples)

### Search Destinations

```http
GET https://test.api.amadeus.com/v1/reference-data/locations?keyword=Paris&subType=CITY

```
