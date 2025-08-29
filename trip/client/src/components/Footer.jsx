import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <Container>
      <Links>
        <SLink to={"/about"}>
          <h4>About</h4>
        </SLink>
        <SLink to={"/terms"}>
          <h4>Terms</h4>
        </SLink>
        <SLink to={"/privacy"}>
          <h4>Privacy</h4>
        </SLink>
        <SLink to={"/sitemap"}>
          <h4>Site Map</h4>
        </SLink>
      </Links>

      <Socials>
        <a href="https://facebook.com" target="_blank" rel="noreferrer">
          <FaFacebookF />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">
          <FaTwitter />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">
          <FaInstagram />
        </a>
        <a href="https://github.com" target="_blank" rel="noreferrer">
          <FaGithub />
        </a>
      </Socials>

      <CopyRight>
        © {new Date().getFullYear()} Trip Planner. All rights reserved.
      </CopyRight>
    </Container>
  );
}

/* ---------- Styles ---------- */

const Container = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-top: 3rem;
  padding: 2rem 1rem;
  background: #222;
  color: #fff;
`;

const Links = styled.div`
  display: flex;
  gap: 2rem;
`;

const SLink = styled(NavLink)`
  text-decoration: none;
  color: #aaa;
  font-size: 0.9rem;

  h4 {
    color: white;
    &:hover {
      color: #ebc014ff;
    }
  }
`;

const Socials = styled.div`
  display: flex;
  gap: 1.2rem;

  a {
    color: #aaa;
    font-size: 1.2rem;
    transition: color 0.3s ease;

    &:hover {
      color: #ebc014ff;
    }
  }
`;

const CopyRight = styled.p`
  font-size: 0.8rem;
  color: #777;
`;

export default Footer;
