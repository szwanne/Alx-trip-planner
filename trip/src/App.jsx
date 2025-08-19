import React from "react";
import Pages from "./pages/Pages";
import NavBar from "./components/NavBar";
import { BrowserRouter } from "react-router-dom";
import Search from "./components/Search";
function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Search />
      <Pages />;
    </BrowserRouter>
  );
}

export default App;
