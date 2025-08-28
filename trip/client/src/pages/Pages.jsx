import React from "react";
import Home from "./Home";
import Profile from "./Profile";
import Searched from "./Searched";
import Place from "./Place";
import { Route, Routes } from "react-router-dom";

function Pages() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile/:type" element={<Profile />} />
      <Route path="/searched/:search" element={<Searched />} />
      <Route path="/place/:name" element={<Place />} />
    </Routes>
  );
}

export default Pages;
