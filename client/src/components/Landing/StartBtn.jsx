import { useNavigate } from "react-router";
import styled from "styled-components";

const StyledStartBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--color-main-100);
  color: #fff;
  text-align: center;
  line-height: 80px;
  font-size: 1rem;

  ::before,
  ::after {
    content: "";
    display: block;
    border: 1px solid var(--color-main-100);
    position: absolute;
    left: -20px;
    right: -20px;
    top: -20px;
    bottom: -20px;
    border-radius: 50%;
    animation: animate 1.5s linear infinite;
    backface-visibility: hidden;
  }

  ::after {
    animation-delay: 0.5s;
  }

  :hover {
    cursor: pointer;
    ::before,
    ::after {
      animation: animate 0.75s linear infinite;
    }

    ::after {
      animation-delay: 0.25s;
    }
  }

  @keyframes animate {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: scale(1.1);
      opacity: 0;
    }
  }
`;

function StartBtn() {
  const navigate = useNavigate();

  const buttonHandler = () => {
    navigate("/home");
  };
  return <StyledStartBtn onClick={buttonHandler}>시작하기</StyledStartBtn>;
}

export default StartBtn;
