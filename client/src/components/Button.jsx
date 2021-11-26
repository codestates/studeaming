import styled from "styled-components";

const StyledButton = styled.div`
  font-size: 14px;
  color: #f5f5f5;
  background-color: #7a7ef4;
  padding: 5px 10px 4px 10px;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 1.8px;
  border-radius: 10px;
  cursor: pointer;
  :hover {
    background-color: #656bff;
  }
`;

function Button({ message, clickEvent }) {
  return (
    <>
      <StyledButton onClick={clickEvent}>{message}</StyledButton>
    </>
  );
}

export default Button;
