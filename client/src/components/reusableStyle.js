import styled from "styled-components";

export const Input = styled.input`
  margin: 0 60px 30px 60px;
  border: none;
  border-bottom: 1px solid #8d8d8d;
  outline: none;
  width: 200px;
  height: 30px;
  background-color: transparent;
  :focus {
    background-color: transparent;
  }
  ::placeholder,
  ::-webkit-input-placeholder {
    color: #6e6e6e;
    text-shadow: 0.5px 0.5px #ffffff;
    font-size: 12px;
    letter-spacing: 1px;
  }
`;
