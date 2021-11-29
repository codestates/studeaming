import { useEffect } from "react";
import styled from "styled-components";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import introImg from "../assets/images/intro_img_2.svg";

const Section = styled.section`
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    height: 100vh;
  }
  background-color: #f8f6ff;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
`;

const Intro = styled.div`
  @media screen and (max-width: 768px) {
    align-items: center;
    padding-top: 90px;
    height: 100%;
    width: 100%;

    /* > .check_letter {
      display: none;
    } */
  }
  display: flex;
  flex-direction: column;
  width: 35%;
  > span {
    letter-spacing: 1px;
    margin: 1px;
  }
`;

const Title = styled.div`
  @media screen and (max-width: 768px) {
    margin-left: 20px;
  }
  font-size: 24px;
  font-weight: bold;
  margin: 20px 20px 20px 0;
`;

const IntroImg1 = styled.div`
  @media screen and (max-width: 768px) {
    object-fit: cover;
    margin-top: 50px;
    display: none;
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

const IntroImg2 = styled.div`
  @media screen and (max-width: 768px) {
    object-fit: cover;
    height: 50%;
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

const Check = styled(FontAwesomeIcon)`
  color: blue;
  margin-top: 20px;
  margin-right: 5px;
`;

function LandingSection2() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".first_intro_img", {
      scrollTrigger: {
        trigger: ".first_intro_img",
        toggleActions: "restart none none none",
      },
      x: 0,
      opacity: 0,
      duration: 3.5,
    });

    gsap.from(".second_intro_img", {
      scrollTrigger: {
        trigger: ".second_intro_img",
        toggleActions: "restart none none none",
      },
      x: 0,
      opacity: 0,
      duration: 3.5,
    });

    gsap.from(".intro_section2", {
      scrollTrigger: {
        trigger: ".intro_section2",
        toggleActions: "restart none none none",
      },
      x: 300,
      opacity: 0,
      duration: 1.5,
    });

    gsap.from(".check_letter.one", {
      scrollTrigger: {
        trigger: ".check_letter.one",
        toggleActions: "restart none none none",
      },
      x: 300,
      duration: 1.5,
      delay: 0.1,
    });

    gsap.from(".check_letter.two", {
      scrollTrigger: {
        trigger: ".check_letter.two",
        toggleActions: "restart none none none",
      },
      x: 300,
      duration: 1.5,
      delay: 0.2,
    });

    gsap.from(".check_letter.three", {
      scrollTrigger: {
        trigger: ".check_letter.three",
        toggleActions: "restart none none none",
      },
      x: 300,
      duration: 1.5,
      delay: 0.3,
    });
  }, []);

  return (
    <Section>
      <IntroImg1 className="first_intro_img" />
      <Intro>
        <Title className="intro_section2">실시간 스터디윗미</Title>
        <span className="intro_section2">
          열심히 공부 중인 모습을 공유하면서
        </span>
        <span className="intro_section2">서로에게 동기부여가 되어보세요.</span>
        <div className="check_letter one">
          <Check icon={faCheck} />
          <span>자신이 공부하는 모습을 보여줄 수 있습니다.</span>
        </div>
        <div className="check_letter two">
          <Check icon={faCheck} />
          <span>ASMR을 들으며 공부할 수 있습니다.</span>
        </div>
        <div className="check_letter three">
          <Check icon={faCheck} />
          <span>누구나 스터디머가 될 수 있습니다.</span>
        </div>
        <IntroImg2 className="second_intro_img" />
      </Intro>
    </Section>
  );
}

export default LandingSection2;
