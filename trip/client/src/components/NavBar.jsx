import { MdModeOfTravel } from "react-icons/md";
import { TfiWorld } from "react-icons/tfi";
import { CgProfile } from "react-icons/cg";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import Search from "./Search";

import React from "react";
import MiniSearchBar from "./MiniSearchBar";

function NavBar() {
  return (
    <List>
      <Logo>
        <SLink to={"/"}>
          <div>
            <MdModeOfTravel />
            <h4>Let's Go</h4>
          </div>
        </SLink>
      </Logo>

      <LeftLink>
        <SLink to={"/explore"}>
          <h4>Explore</h4>
        </SLink>
        <SLink to={"/trips"}>
          <h4>Trips</h4>
        </SLink>
        <SLink to={"/hotels"}>
          <h4>Hotel</h4>
        </SLink>
        <SLink to={"/flights"}>
          <h4>Flights</h4>
        </SLink>
      </LeftLink>

      <RightLink>
        <MiniSearchBar />
        <SLink to={"/languages"}>
          <TfiWorld />
        </SLink>
        <SLink to={"/profile"}>
          <CgProfile />
        </SLink>
      </RightLink>
    </List>
  );
}

const List = styled.div`
  display: flex;
  justify-content: space-between;
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

const LeftLink = styled.div`
  display: flex;
`;
const RightLink = styled.div`
  display: flex;
  gap: 15px;
`;

const Logo = styled.div`
  div {
    display: flex;
    gap: 15px;
    font-size: 30px;
    padding-top: 15px;
    align-items: center;
  }
  h4 {
    line-height: 65px;
  }
`;

export default NavBar;
