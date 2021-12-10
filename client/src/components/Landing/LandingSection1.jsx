import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../Button";

const Container = styled.div`
  width: 100%;
  min-width: 330px;
  height: calc(100vh - 69.28px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  #start-btn-container {
    margin-top: 1rem;
  }

  #scroll-line {
    height: 100px;
    width: 1.5px;
    margin: 50px 0 20px;
    background-color: var(--color-main-75);
  }

  #scroll-text {
    font-size: 0.9rem;
    color: var(--color-main-75);
  }
`;

const WelcomeMsg = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-black);
  text-align: center;
`;

const StartBtn = styled.button`
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

function LandingSection1() {
  const navigate = useNavigate();

  const startBtnHandler = () => {
    navigate("/home");
  };

  return (
    <Container>
      <WelcomeMsg>
        스터디밍에서 함께 공부하고
        <br />
        나만의 기록을 남기세요
      </WelcomeMsg>
      <div id="start-btn-container">
        <StartBtn>시작하기</StartBtn>
      </div>
      <div id="scroll-line"></div>
      <div id="scroll-text">스크롤</div>
    </Container>
  );
}

export default LandingSection1;
