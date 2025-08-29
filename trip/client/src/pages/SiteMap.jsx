import React from "react";
import styled from "styled-components";

function SiteMap() {
  return (
    <Card>
      <h1>Site Map</h1>
      <ul>
        <li>Home</li>
        <li>Destinations</li>
        <li>Profile</li>
        <li>About</li>
        <li>Terms</li>
        <li>Privacy</li>
      </ul>
    </Card>
  );
}

export default SiteMap;

const Card = styled.div`
  padding: 2rem;
  h1 {
    margin-bottom: 10px;
  }
`;
