import { useState } from "react";
import styled from "styled-components";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

function Profile() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Dummy handlers (replace with your API or Firebase later)
  const handleGoogleSignUp = () => {
    console.log("Sign up with Google");
  };

  const handleGithubSignUp = () => {
    console.log("Sign up with GitHub");
  };

  const handleEmailSignUp = () => {
    console.log("Sign up with Email:", email, password);
  };

  const handleLogin = () => {
    console.log("Redirect to login page");
  };

  return (
    <Container>
      <Card>
        <Title>Create Account</Title>

        {/* Social signup buttons */}
        <Button onClick={handleGoogleSignUp} google>
          <FaGoogle /> Sign up with Google
        </Button>

        <Button onClick={handleGithubSignUp} github>
          <FaGithub /> Sign up with GitHub
        </Button>

        <Divider>or use email</Divider>

        {/* Email and password */}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleEmailSignUp}>Sign up with Email</Button>

        {/* Footer actions */}
        <Footer>
          <LoginLink onClick={handleLogin}>
            Already have an account? Login
          </LoginLink>
          <Link to="/forgot-password">Forgot Password?</Link>
        </Footer>
      </Card>
    </Container>
  );
}

export default Profile;

/* ---------- Styles ---------- */

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9fafb;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #111;
`;

const Button = styled.button`
  width: 100%;
  background: ${(props) =>
    props.google ? "#db4437" : props.github ? "#333" : "#0077ff"};
  color: white;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: ${(props) =>
      props.google ? "#c1351d" : props.github ? "#000" : "#005fcc"};
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 1rem 0;
  color: #666;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
`;

const Footer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;

  a {
    color: #555;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginLink = styled.button`
  background: none;
  border: none;
  color: #0077ff;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;
