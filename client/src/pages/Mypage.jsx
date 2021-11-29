import styled from "styled-components";
import Sidebar from "../components/Sidebar";

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
`;

function Mypage() {
  return (
    <Container>
      <Sidebar />
    </Container>
  );
}

export default Mypage;
