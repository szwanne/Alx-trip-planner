import { FaPizzaSlice, FaHamburger } from "react-icons/fa";
import { GiNoodles, GiChopsticks } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import React from "react";

function NavBar() {
  return (
    <List>
      <SLink to={"/explore"}>
        <h4>Explore</h4>
      </SLink>
      <SLink to={"/trips"}>
        <h4>Trips</h4>
      </SLink>
      <SLink to={"/inbox"}>
        <h4>Inbox</h4>
      </SLink>
      <SLink to={"/travel"}>
        <h4>Travel</h4>
      </SLink>
    </List>
  );
}

const List = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0rem;
  gap: 20px;
`;

const SLink = styled(NavLink)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-right: 2rem;
  text-decoration: none;
`;

export default NavBar;
