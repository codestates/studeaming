import { useEffect } from "react";
import styled from "styled-components";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImCheckmark } from "react-icons/im";

const Container = styled.div`
  height: 100%;
  width: 100%;
  min-width: 330px;
  padding: 30px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  #section2-container {
    display: flex;
    align-items: flex-start;
    gap: 40px;

    @media screen and (max-width: 900px) {
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
  }
`;

const ImgContainer = styled.div`
  width: 500px;
  height: 280px;
  background-image: url(${(props) => props.img});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  box-shadow: 0px 0px 10px var(--color-gray-bg-100);

  @media screen and (max-width: 600px) {
    width: 330px;
    height: 175px;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media screen and (max-width: 900px) {
    align-items: center;
    order: -1;
  }

  h2 {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--color-black);
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 1.6rem;
  }

  #stream-description-container {
    @media screen and (max-width: 900px) {
      align-items: center;
    }

    .stream-description {
      display: flex;
      justify-content: flex-start;
      align-items: start;
      margin-bottom: 0.2rem;
    }
  }

  #stream-description {
    display: flex;
    align-items: flex-start;
    margin: 0.2rem 0;
  }
`;

const StyledCheck = styled(ImCheckmark)`
  color: var(--color-main-100);
  margin: 0.2rem 1rem 0.2rem 0;
  display: inline-block;

  + span {
    display: inline-block;
  }
`;

function LandingSection2() {
  gsap.registerPlugin(ScrollTrigger);
  useEffect(() => {
    gsap.from("#stream-header", {
      scrollTrigger: {
        trigger: "#stream-header",
        toggleActions: "restart none none none",
      },
      y: 50,
      duration: 0.4,
      opacity: 0,
    });
    gsap.from("#stream-header-desc", {
      scrollTrigger: {
        trigger: "#stream-header",
        toggleActions: "restart none none none",
      },
      y: 50,
      duration: 0.4,
      opacity: 0,
      delay: 0.2,
    });
    gsap.from("#stream-description-1", {
      scrollTrigger: {
        trigger: "#stream-header",
        toggleActions: "restart none none none",
      },
      y: 50,
      duration: 0.4,
      opacity: 0,
      delay: 0.4,
    });
    gsap.from("#stream-description-2", {
      scrollTrigger: {
        trigger: "#stream-header",
        toggleActions: "restart none none none",
      },
      y: 50,
      duration: 0.4,
      opacity: 0,
      delay: 0.6,
    });
    gsap.from("#stream-description-3", {
      scrollTrigger: {
        trigger: "#stream-header",
        toggleActions: "restart none none none",
      },
      y: 50,
      duration: 0.4,
      opacity: 0,
      delay: 0.8,
    });
  }, []);

  return (
    <Container>
      <div id="section2-container">
        <ImgContainer
          className="section2-image"
          img="/assets/images/landing_streaming.gif"
        />
        <TextContainer>
          <h2 id="stream-header">실시간 스터디윗미</h2>
          <h3 id="stream-header-desc">
            공부하는 모습을 실시간으로 송출해보세요
          </h3>
          <div id="stream-description-container">
            <div id="stream-description-1" className="stream-description">
              <StyledCheck />
              <span>누구든 스터디머가 될 수 있습니다!</span>
            </div>
            <div id="stream-description-2" className="stream-description">
              <StyledCheck />
              <span>
                ASMR 찾아다니지 마세요 <br />
                제공되는 백색소음을 선택해서 재생할 수 있습니다
              </span>
            </div>
            <div id="stream-description-3" className="stream-description">
              <StyledCheck />
              <span>
                서로에게 응원을 보낼 수 있는
                <br />
                클린한 채팅 기능이 준비되어있습니다
              </span>
            </div>
          </div>
        </TextContainer>
      </div>
    </Container>
  );
}

export default LandingSection2;
