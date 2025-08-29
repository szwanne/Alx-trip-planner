import React from "react";
import styled from "styled-components";

function Terms() {
  return (
    <Card>
      <h1>Terms and Conditions</h1>
      <p>
        By using this app, you agree to follow our terms of service. We aim to
        provide accurate and reliable information, but travel details may vary.
      </p>
    </Card>
  );
}

export default Terms;

const Card = styled.div`
  padding: 2rem;
  h1 {
    margin-bottom: 10px;
  }
`;
