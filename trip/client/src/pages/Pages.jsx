import React from "react";
import Home from "./Home";
import Profile from "./Profile";
import Searched from "./Searched";
import Place from "./Place";
import Explore from "./Explore";
import Trips from "./Trips";
import Hotel from "./Hotel";
import Flight from "./Flight";
import { Route, Routes } from "react-router-dom";

function Pages() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile/:type" element={<Profile />} />
      <Route path="/searched/:search" element={<Searched />} />
      <Route path="/place/:id" element={<Place />} />
      <Route path="/explore/" element={<Explore />} />
      <Route path="/trips/" element={<Trips />} />
      <Route path="/hotels/" element={<Hotel />} />
      <Route path="/flights/" element={<Flight />} />
      <Route path="/profile/" element={<Profile />} />
    </Routes>
  );
}

export default Pages;
