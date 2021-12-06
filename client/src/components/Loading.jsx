import styled from "styled-components";
import loading from "../assets/images/loading.gif";

const LoadingSection = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);

  > img {
    width: 30px;
    height: 30px;
    background-color: transparent;
  }
`;

function Loading() {
  return (
    <LoadingSection>
      <img src={loading} alt="loading..." />
    </LoadingSection>
  );
}

export default Loading;
