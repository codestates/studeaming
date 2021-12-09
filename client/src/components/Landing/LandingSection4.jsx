import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../Button";

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 69.28px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: start;
  position: relative;

  > .button_section {
    width: 10rem;
    position: absolute;
    bottom: 0px;
    right: 0px;

    @media screen and (max-width: 600px) {
      right: 25%;
      bottom: -70px;
    }
  }

  @media screen and (max-width: 900px) {
    flex-direction: column;
    height: 650px;
  }
`;

const SideLogImg = styled.div`
  width: 300px;
  height: 550px;
  border: 1px solid;
  position: relative;

  @media screen and (max-width: 900px) {
    width: 250px;
    height: 450px;
    position: absolute;
    left: 60px;
    bottom: 30px;
  }

  @media screen and (max-width: 600px) {
    width: 250px;
    height: 450px;
    position: absolute;
    left: 0px;
    bottom: 0px;
  }
`;

const ToggleImg1 = styled.div`
  width: 80px;
  height: 80px;
  border: 1px solid;
  border-radius: 0.5rem;
  position: absolute;
  right: 15%;
  bottom: 30%;

  @media screen and (max-width: 900px) {
    width: 70px;
    height: 70px;
  }

  @media screen and (max-width: 600px) {
    right: 35%;
  }
`;

const ToggleImg2 = styled.div`
  width: 80px;
  height: 80px;
  border: 1px solid;
  border-radius: 0.5rem;
  position: absolute;
  right: -20%;
  bottom: 20%;

  @media screen and (max-width: 900px) {
    width: 70px;
    height: 70px;
  }

  @media screen and (max-width: 600px) {
    right: 3%;
  }
`;

const Description = styled.section`
  display: flex;
  flex-direction: column;
  align-items: start;
  padding-left: 40px;

  @media screen and (max-width: 900px) {
    order: -1;
    padding: 0;
    margin-left: 300px;
    align-items: end;
  }

  @media screen and (max-width: 600px) {
    margin-left: 0px;
  }

  > h2 {
    font-size: 1.6rem;
    margin-bottom: 25px;
  }

  > div {
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-bottom: 30px;
    font-size: 1.15rem;

    @media screen and (max-width: 900px) {
      align-items: end;
    }
  }
`;

function LandingSection4() {
  const navigate = useNavigate();

  const buttonHandler = () => {
    navigate("/home");
  };

  return (
    <Container>
      <Wrapper>
        <SideLogImg>
          <ToggleImg1 />
          <ToggleImg2 />
        </SideLogImg>
        <Description>
          <h2>공부 습관</h2>
          <div>
            <span>더 이상 다이어리를 꺼내 메모하지 마세요</span>
          </div>
          <div>
            <span>클릭 한번으로 공부 시간을 간편하게 기록하고</span>
            <span>하루의 공부 패턴을 확인할 수 있습니다</span>
          </div>
        </Description>
        <div className="button_section">
          <Button message="시작하기" clickEvent={buttonHandler} />
        </div>
      </Wrapper>
    </Container>
  );
}

export default LandingSection4;
