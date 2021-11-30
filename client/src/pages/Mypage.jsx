import styled from "styled-components";
import Sidebar from "../components/Sidebar";

const Container = styled.div`
  display: flex;
  justify-content: flex-start;

  @media screen and (max-width: 768px) {
    justify-content: flex-end;
    flex-direction: column;
  }
`;

const Calendar_temp = styled.div`
  width: calc(100vw - 300px);
  height: calc(100vh - 61.69px);
  background-color: lightgreen;

  @media screen and (max-width: 768px) {
    width: 100vw;
    min-width: 400px;
    order: -1;
  }
`;

function Mypage() {
  return (
    <Container>
      <Sidebar />
      <Calendar_temp />
    </Container>
  );
}

export default Mypage;
