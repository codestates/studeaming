import styled from "styled-components";
import BackgroundCircle from "../components/Landing/BackgroundCircle";
import Welcome from "../components/Landing/Welcome";
import LandingSection1 from "../components/Landing/LandingSection1";
import LandingSection2 from "../components/Landing/LandingSection2";
import LandingSection3 from "../components/Landing/LandingSection3";
import LandingSection4 from "../components/Landing/LandingSection4";
import Footer from "../components/Footer";
import TopBtn from "../components/TopBtn";

const LandingContainer = styled.section`
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  scroll-behavior: smooth;

  > #content-box {
    width: 1000px;

    .pin-spacer {
      inset: none;
    }

    @media screen and (max-width: 1000px) {
      width: 100%;
    }
  }
`;

function Landing() {
  const newWindow = window.history.state.idx;

  return (
    <>
      <LandingContainer>
        <div id="content-box">
          <BackgroundCircle />
          {newWindow === 0 ? <Welcome /> : null}
          <LandingSection1 />
          <LandingSection2 />
          <LandingSection3 />
          <LandingSection4 />
        </div>
      </LandingContainer>
      <TopBtn />
      <Footer />
    </>
  );
}

export default Landing;
