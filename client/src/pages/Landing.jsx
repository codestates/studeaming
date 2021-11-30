import styled from "styled-components";
import LandingSection1 from "../components/LandingSection1";
import LandingSection2 from "../components/LandingSection2";
import LandingSection3 from "../components/LandingSection3";
import Footer from "../components/Footer";
import TopBtn from "../components/TopBtn";

const LandingContainer = styled.section`
  width: 100%;
  height: 360vh;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
`;

function Landing() {
  return (
    <>
      <LandingContainer>
        <LandingSection1 />
        <LandingSection2 />
        <LandingSection3 />
      </LandingContainer>
      <TopBtn />
      <Footer />
    </>
  );
}

export default Landing;
