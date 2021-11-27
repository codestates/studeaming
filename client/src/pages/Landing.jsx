import styled from "styled-components";
import Footer from "../components/Footer";

const LandingContainer = styled.div`
  width: 100%;
  height: 400px;
`;

function Landing() {
  return (
    <div>
      <LandingContainer />
      <Footer />
    </div>
  );
}

export default Landing;
