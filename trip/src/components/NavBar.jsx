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
        <SLink to={"/inbox"}>
          <h4>Inbox</h4>
        </SLink>
        <SLink to={"/travel"}>
          <h4>Travel</h4>
        </SLink>
      </LeftLink>

      <RightLink>
        <MiniSearchBar />
        <SLink to={"/explore"}>
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
  }
`;

export default NavBar;
