import styled from "styled-components";

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

  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

const Description = styled.section`
  display: flex;
  flex-direction: column;
  align-items: end;
  padding-right: 40px;
  min-width: 352px;

  @media screen and (max-width: 900px) {
    align-items: start;
    padding: 0;
  }

  @media screen and (max-width: 600px) {
    min-width: 330px;
  }

  > h2 {
    font-size: 1.6rem;
  }

  > span {
    margin-bottom: 20px;
    font-size: 1.15rem;
    text-align: end;

    @media screen and (max-width: 900px) {
      text-align: start;
    }
  }
`;

const CalenderImg = styled.div`
  width: 500px; //600px or 800px
  height: 300px; //375px or 500px
  position: relative;
  border: 1px solid;

  @media screen and (max-width: 600px) {
    width: 330px;
    height: 198px;
  }
`;

const DailyImg = styled.div`
  position: absolute;
  width: 500px; //600px or 800px
  height: 300px; //375px or 500px
  opacity: 0;

  @media screen and (max-width: 600px) {
    width: 330px;
    height: 198px;
  }
`;

function LandingSection3() {
  return (
    <Container>
      <Wrapper>
        <Description>
          <h2>학습 기록 관리</h2>
          <span>미션을 성공하고 훈장을 모아보세요</span>
          <span>
            월별 공부시간을 한 눈에 확인해보세요
            <br />
            공부 시간이 많아질수록 포도 농장이 풍성해집니다
          </span>
          <span>
            매일의 공부 기록을 확인할 수 있습니다
            <br />
            그날의 코멘트도 남겨보세요
          </span>
        </Description>
        <CalenderImg>
          <DailyImg />
        </CalenderImg>
      </Wrapper>
    </Container>
  );
}

export default LandingSection3;
