import React from "react";
import Pages from "./pages/Pages";
import NavBar from "./components/NavBar";
import { BrowserRouter } from "react-router-dom";
import Search from "./components/Search";
import Footer from "./components/Footer";
function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Search />
      <Pages />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
