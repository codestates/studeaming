import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: calc(100vh - 61.69px);
  background-color: var(--color-main-0);

  h2 {
    font-weight: 500;
    font-size: 1.2rem;
  }

  #notfound-description {
    color: var(--color-black-50);
    font-size: 0.9rem;
  }

  #notfound-btn-container {
    margin: 1rem 0;
    width: 100px;
  }
`;

function NotFound() {
  return (
    <Container>
      <h2>페이지가 존재하지 않습니다.</h2>
      <div id="notfound-description">
        링크를 잘못 입력하셨거나 페이지가 삭제 또는 이동되었을 수 있습니다.
      </div>
      <Link to="/home">
        <div id="notfound-btn-container">
          <Button message="홈으로" />
        </div>
      </Link>
    </Container>
  );
}

export default NotFound;
