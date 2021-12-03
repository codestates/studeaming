import styled from "styled-components";
import loading from "../assets/images/loading.gif";

const LoadingSection = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  > img {
    width: ${(props) => props.wsize}px;
    height: ${(props) => props.hsize}px;
  }
`;

function Loading({ wsize, hsize }) {
  return (
    <LoadingSection wsize={wsize} hsize={hsize}>
      <img src={loading} alt="loading..." />
    </LoadingSection>
  );
}

export default Loading;
