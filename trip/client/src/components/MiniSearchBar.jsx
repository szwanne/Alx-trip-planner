import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function MiniSearchBar() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    navigate("/searched/" + input);
  };
  return (
    <FormStyle onSubmit={submitHandler}>
      <div>
        <FaSearch></FaSearch>
        <input
          onChange={(e) => {
            setInput(e.target.value);
          }}
          type="text"
          value={input}
        />
      </div>
    </FormStyle>
  );
}

const FormStyle = styled.form`
  margin: 1.5rem 2rem;
  input {
    border: none;
    background: linear-gradient(35deg, #494949, #313132);
    font-size: 1.5rem;
    color: white;
    padding: 0.5rem 0.5rem;
    border-radius: 1rem;
    outline: none;
    width: 150px;
  }

  div {
    width: 10%;
    position: relative;
  }

  svg {
    position: absolute;
    top: 50%;
    left: -10%;
    transform: translate(100%, -50%);
    color: white;
  }
`;

export default MiniSearchBar;
