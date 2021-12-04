import styled from "styled-components";

export const AuthContainer = styled.div`
  width: 280px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h2`
  font-size: 16px;
  font-weight: 500;
  color: #444453;
  margin-bottom: 20px;
  display: block;
`;

export const InputContainer = styled.div`
  /* padding: 16px; */
  margin-bottom: 12px;
  width: 220px;
  display: flex;
  flex-direction: column;
  :nth-last-of-type(2) {
    margin-bottom: 20px;
  }
`;

export const Desc = styled.label`
  font-size: 12px;
  display: inline-block;
  color: #8d8d8d;
  margin-bottom: 5px;
`;

export const Input = styled.input`
  font-family: "NotoSans" !important;
  font-size: 0.9rem;
  margin-bottom: 5px;
  border: none;
  border-radius: 8px;
  outline: none;
  width: 100%;
  height: 40px;
  padding: 5px 10px;
  background-color: #f7f7ff;
  :focus {
    background-color: #f6f8ff;
    border: 1.5px solid #7a7ef4;
  }
  ::placeholder,
  ::-webkit-input-placeholder {
    color: #6e6e6e;
    text-shadow: 0.5px 0.5px #ffffff;
    font-size: 12px;
    letter-spacing: 1px;
  }
`;

export const ErrorMsg = styled.span`
  display: inline-block;
  color: ${(props) => (props.isNoti ? "green" : "#f04949")};
  font-size: 10px;
`;
