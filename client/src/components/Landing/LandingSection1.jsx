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
    width: 10rem;
    padding: 2px;
    border: 1px solid var(--color-main-50);
    border-radius: 10px;
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
        <Button clickEvent={startBtnHandler} message="시작하기" />
      </div>
      <div id="scroll-line"></div>
      <div id="scroll-text">스크롤</div>
    </Container>
  );
}

export default LandingSection1;
