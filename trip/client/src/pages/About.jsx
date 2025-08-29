import React from "react";
import styled from "styled-components";

function About() {
  return (
    <Card>
      <h1>About Us</h1>
      <p>
        Welcome to our Trip Planner app. We help you explore destinations, plan
        trips, and make your travel experience smoother.
      </p>
    </Card>
  );
}

export default About;

const Card = styled.div`
  padding: 2rem;
  h1 {
    margin-bottom: 10px;
  }
`;
