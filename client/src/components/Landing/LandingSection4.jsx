import { useEffect } from "react";
import styled from "styled-components";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ToggleSection, Name, ToggleBackground, Circle } from "../ToggleBox";
import StartBtn from "./StartBtn";

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: -200px;

  @media screen and (max-width: 600px) {
    margin-top: -50px;
  }

  @media screen and (max-width: 480px) {
    height: calc(100vh - 60px);
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: start;
  position: relative;

  > .button_section {
    position: absolute;
    bottom: 0px;
    right: 0px;

    @media screen and (max-width: 600px) {
      display: none;
    }
  }

  @media screen and (max-width: 900px) {
    flex-direction: column;
    height: 650px;
  }
`;

const ImageContainer = styled.div`
  width: 300px;
  height: 550px;
  position: relative;

  @media screen and (max-width: 900px) {
    width: 250px;
    height: 450px;
    position: absolute;
    left: 60px;
    bottom: 30px;
  }

  @media screen and (max-width: 600px) {
    position: relative;
    align-self: center;
    left: 0px;
    bottom: 0px;
    margin-top: 20px;
  }
`;

const SideLogImg = styled.div`
  width: 100%;
  height: 100%;
  /* border: 1px solid; */
  box-shadow: 0 0 10px var(--color-black-25);
  position: relative;
  background-image: url("/assets/images/logchartimg.png");
  background-size: contain;
  border-radius: 1.5rem;

  > #moving-log {
    position: absolute;
    top: 40.6%;
    left: 16%;
    width: 0;
    height: 2.8%;
    background-color: var(--color-blue);
  }
`;

const ToggleImg1 = styled(ToggleSection)`
  position: absolute;
  right: 15%;
  bottom: 30%;
  box-shadow: 0 0 10px var(--color-black-25);

  @media screen and (max-width: 900px) {
    width: 70px;
    height: 70px;
  }

  @media screen and (max-width: 600px) {
    right: 35%;
  }
`;

const ToggleImg2 = styled(ToggleSection)`
  position: absolute;
  right: -20%;
  bottom: 20%;
  box-shadow: 0 0 10px var(--color-black-25);

  @media screen and (max-width: 900px) {
    width: 70px;
    height: 70px;
  }

  @media screen and (max-width: 600px) {
    right: 3%;
  }
`;

const ToggleBack = styled(ToggleBackground)`
  background: var(--color-gray-bg-100);
`;

const Description = styled.section`
  display: flex;
  flex-direction: column;
  align-items: start;
  padding-left: 40px;

  @media screen and (max-width: 900px) {
    order: -1;
    padding: 0;
    margin-left: 300px;
    align-items: end;
  }

  @media screen and (max-width: 600px) {
    margin-left: 0px;
  }

  > h2 {
    font-size: 1.6rem;
    margin-bottom: 25px;

    @media screen and (max-width: 600px) {
      margin-bottom: 10px;
    }
  }

  > span {
    text-align: start;
    margin-bottom: 30px;
    font-size: 1.15rem;
    opacity: 0;

    @media screen and (max-width: 900px) {
      text-align: end;
    }

    @media screen and (max-width: 600px) {
      margin-bottom: 10px;
    }
  }
`;

function LandingSection4() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from("#toggle-image1", {
      scrollTrigger: {
        trigger: "#section4-container",
        toggleActions: "restart none none none",
        start: "top center",
      },
      x: -50,
      duration: 1,
      opacity: 0,
      ease: "power0",
    });

    gsap.from("#toggle-image2", {
      scrollTrigger: {
        trigger: "#section4-container",
        toggleActions: "restart none none none",
        start: "top center",
      },
      x: 50,
      duration: 1,
      delay: 0.5,
      opacity: 0,
      ease: "power0",
    });

    gsap.to("#section4-description-1", {
      scrollTrigger: {
        trigger: "#section4-container",
        toggleActions: "restart none none none",
        start: "top center",
      },
      duration: 1,
      opacity: 1,
      ease: "power1",
    });

    gsap.to("#section4-description-2", {
      scrollTrigger: {
        trigger: "#section4-container",
        toggleActions: "restart none none none",
        start: "top center",
      },
      duration: 1,
      delay: 0.5,
      opacity: 1,
      ease: "power1",
    });

    gsap.to("#moving-circle", {
      scrollTrigger: {
        trigger: "#section4-container",
        toggleActions: "restart none none none",
        start: "top center",
      },
      delay: 1.5,
      duration: 0.5,
      x: 20,
    });

    gsap.to("#toggle-back", {
      scrollTrigger: {
        trigger: "#section4-container",
        toggleActions: "restart none none none",
        start: "top center",
      },
      delay: 1.5,
      duration: 0.5,
      backgroundColor: "#E2ECFC",
    });

    gsap.to("#moving-log", {
      scrollTrigger: {
        trigger: "#section4-container",
        toggleActions: "restart none none none",
        start: "top center",
      },
      delay: 2,
      duration: 1,
      width: 150,
    });
  }, []);

  return (
    <Container>
      <Wrapper id="section4-container">
        <ImageContainer>
          <SideLogImg>
            <div id="moving-log" />
          </SideLogImg>
          <ToggleImg1 id="toggle-image1">
            <Name>기하와 벡터</Name>
            <ToggleBack id="toggle-back" color="blue">
              <Circle id="moving-circle" />
            </ToggleBack>
          </ToggleImg1>
          <ToggleImg2 id="toggle-image2">
            <Name>미분과 적분</Name>
            <ToggleBackground color="red">
              <Circle />
            </ToggleBackground>
          </ToggleImg2>
        </ImageContainer>
        <Description>
          <h2>공부 습관</h2>
          <span id="section4-description-1">
            더 이상 다이어리를 꺼내 메모하지 마세요
          </span>
          <span id="section4-description-2">
            클릭 한번으로 공부 시간을 간편하게 기록하고
            <br />
            하루의 공부 패턴을 확인할 수 있습니다
          </span>
        </Description>
        <div className="button_section">
          <StartBtn />
        </div>
      </Wrapper>
    </Container>
  );
}

export default LandingSection4;
