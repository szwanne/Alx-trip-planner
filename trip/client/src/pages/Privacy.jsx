import React from "react";
import styled from "styled-components";

function Privacy() {
  return (
    <Card>
      <h1>Privacy Policy</h1>
      <p>
        Your privacy is important to us. We only use your data to improve your
        travel planning experience and do not share it with third parties.
      </p>
    </Card>
  );
}

export default Privacy;

const Card = styled.div`
  padding: 2rem;
  h1 {
    margin-bottom: 10px;
  }
`;
