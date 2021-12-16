import styled from "styled-components";
import StartBtn from "./StartBtn";

const Container = styled.div`
  width: 100%;
  min-width: 330px;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 480px) {
    height: calc(100vh - 60px);
  }

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

function LandingSection1() {
  return (
    <Container>
      <WelcomeMsg>
        스터디밍에서 함께 공부하고
        <br />
        나만의 기록을 남기세요
      </WelcomeMsg>
      <div id="start-btn-container">
        <StartBtn />
      </div>
      <div id="scroll-line"></div>
      <div id="scroll-text">스크롤</div>
    </Container>
  );
}

export default LandingSection1;
