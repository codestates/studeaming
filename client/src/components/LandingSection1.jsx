import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import introImg from "../assets/images/intro_img_1.svg";

const Section = styled.section`
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
`;

const Intro = styled.div`
  @media screen and (max-width: 768px) {
    justify-content: center;
    align-items: center;
    padding-top: 80px;
    min-width: 414px;
  }
  display: flex;
  flex-direction: column;
  align-items: end;
  width: 40%;

  > span {
    font-size: 24px;
  }
`;

const Button1 = styled.div`
  @media screen and (max-width: 768px) {
    display: none;
  }
  font-size: 14px;
  color: #f5f5f5;
  background-color: #7a7ef4;
  padding: 5px 10px 4px 10px;
  width: 200px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 1.8px;
  border-radius: 3rem;
  cursor: pointer;
  margin-top: 40px;
  :hover {
    background-color: #656bff;
  }
`;

const Button2 = styled.div`
  @media screen and (max-width: 768px) {
    font-size: 14px;
    color: #f5f5f5;
    background-color: #7a7ef4;
    padding: 5px 10px 4px 10px;
    width: 250px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-width: 1.8px;
    border-radius: 3rem;
    cursor: pointer;
    :hover {
      background-color: #656bff;
    }
  }
  display: none;
`;

const IntroImg = styled.div`
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
  height: 70%;
`;

function LandingSection1() {
  const navigate = useNavigate();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".intro_section1", {
      scrollTrigger: {
        trigger: ".intro_section1",
        toggleActions: "restart none none none",
      },
      x: -100,
      duration: 1,
    });

    gsap.to(".intro_section1", {
      scrollTrigger: {
        trigger: ".intro_section1",
        toggleActions: "restart none none none",
      },
      x: 0,
      duration: 1,
    });

    gsap.from(".intro_img", {
      scrollTrigger: {
        trigger: ".intro_img",
        toggleActions: "restart none none none",
      },
      x: 100,
      opacity: 0,
      duration: 1,
    });

    gsap.from(".btn2", {
      scrollTrigger: {
        trigger: ".btn2",
        toggleActions: "restart none none none",
      },
      y: 30,
      duration: 1,
    });
  }, []);

  return (
    <Section>
      <Intro className="intro_section1">
        <span>열심히 공부 중인</span>
        <span>studeamer와 함께</span>
        <span>공부해볼까요?</span>
        <Button1 onClick={() => navigate("/home")}>
          studeaming 함께 하기
        </Button1>
      </Intro>
      <IntroImg className="intro_img" />
      <Button2 className="btn2" onClick={() => navigate("/home")}>
        studeaming 함께 하기
      </Button2>
    </Section>
  );
}

export default LandingSection1;
