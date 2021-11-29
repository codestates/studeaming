import { useEffect } from "react";
import styled from "styled-components";
import { gsap, Bounce } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import introImg from "../assets/images/intro_img_3.svg";

const Section = styled.section`
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    height: 80vh;
  }
  width: 100%;
  height: 80vh;
  display: flex;
  align-items: center;
`;

const Intro = styled.div`
  @media screen and (max-width: 768px) {
    align-items: start;
    padding: 90px 0 0 90px;
    width: 100%;
  }
  @media screen and (max-width: 414px) {
    padding-left: 40px;
  }
  display: flex;
  flex-direction: column;
  align-items: end;
  width: 40%;
  padding-bottom: 230px;
  > span {
    letter-spacing: 1px;
    margin: 1px;
  }
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const IntroImg = styled.div`
  @media screen and (max-width: 768px) {
    object-fit: cover;
    height: 60%;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${introImg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 90%;
  min-width: 414px;
  height: 80%;
`;

function LandingSection3() {
  useEffect(() => {
    gsap.from(".intro_img_section3", {
      scrollTrigger: {
        trigger: ".intro_img_section3",
        toggleActions: "restart none none none",
      },
      opacity: 0.5,
      transformOrigin: "center",
      rotate: 360,
      x: 300,
      y: -300,
      scale: 0.2,
      duration: 2,
    });

    gsap.to(".intro_img_section3", {
      scrollTrigger: {
        trigger: ".intro_img_section3",
        toggleActions: "restart none none none",
      },
      opacity: 1,
      transformOrigin: "center",
      rotate: 0,
      y: 0,
      duration: 2,
      ease: Bounce.easeOut,
    });

    gsap.from(".intro_section3", {
      scrollTrigger: {
        trigger: ".intro_img_section3",
        toggleActions: "restart none none none",
      },
      opacity: 0,
      duration: 2,
    });
  }, []);
  return (
    <Section>
      <Intro className="intro_section3">
        <Title>학습 캘린더</Title>
        <span>학습 히스토리를 기록할 수 있습니다.</span>
      </Intro>
      <IntroImg className="intro_img_section3" />
    </Section>
  );
}

export default LandingSection3;
