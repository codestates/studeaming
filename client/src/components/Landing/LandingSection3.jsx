import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media screen and (max-width: 480px) {
    height: calc(100vh - 60px);
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: start;

  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

const Description = styled.section`
  display: flex;
  flex-direction: column;
  align-items: end;
  padding-right: 40px;
  min-width: 352px;

  @media screen and (max-width: 900px) {
    align-items: start;
    padding: 0;
  }

  @media screen and (max-width: 600px) {
    min-width: 330px;
  }

  > h2 {
    font-size: 1.6rem;
  }

  > span {
    margin-bottom: 20px;
    font-size: 1.15rem;
    text-align: end;
    opacity: 0;

    @media screen and (max-width: 900px) {
      text-align: start;
    }
  }
`;

const ImageContainer = styled.div`
  width: 500px; //600px or 800px
  height: 300px;
  position: relative;

  @media screen and (max-width: 600px) {
    width: 330px;
    height: 198px;
  }
`;

const CalenderImg = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid;

  @media screen and (max-width: 600px) {
    width: 330px;
    height: 198px;
  }
`;

const DailyImg = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  background-color: lightgrey;

  @media screen and (max-width: 600px) {
    width: 330px;
    height: 198px;
  }
`;

function LandingSection3() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#section3-container",
        pin: true,
        scrub: true,
        start: "top 69.28px",
      },
    });
    tl.from("#section3-image", {
      scale: 2,
      x: 400,
    })
      .to("#section3-description-2", {
        opacity: 1,
      })
      .to("#section3-modal-image, #section3-description-3", {
        opacity: 1,
      });

    gsap.to("#section3-description-1", {
      scrollTrigger: {
        trigger: "#section3-container",
        toggleActions: "restart none none none",
        start: "top center",
      },
      opacity: 1,
      duration: 0.5,
    });
  });
  return (
    <Container id="section3-container">
      <Wrapper>
        <Description>
          <h2>학습 기록 관리</h2>
          <span id="section3-description-1">
            미션을 성공하고 훈장을 모아보세요
          </span>
          <span id="section3-description-2">
            월별 공부시간을 한 눈에 확인해보세요
            <br />
            공부 시간이 많아질수록 🍇포도 농장이 풍성해집니다
          </span>
          <span id="section3-description-3">
            매일의 공부 기록을 확인할 수 있습니다
            <br />
            그날의 코멘트도 남겨보세요
          </span>
        </Description>
        <ImageContainer>
          <CalenderImg id="section3-image" />
          <DailyImg id="section3-modal-image" />
        </ImageContainer>
      </Wrapper>
    </Container>
  );
}

export default LandingSection3;
