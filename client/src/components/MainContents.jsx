import styled from "styled-components";
import defaultImg from "../assets/images/img_profile_default.svg";

const StyledMainContents = styled.section`
  display: grid;
  place-items: center;
  grid-template-rows: repeat(auto-fill, 1fr);
  grid-template-columns: repeat(5, 1fr);
  padding: 0 50px;
  gap: 40px 10px;

  @media screen and (max-width: 1200px) {
    grid-template-rows: repeat(auto-fill, 1fr);
    grid-template-columns: repeat(4, 1fr);
    gap: 10px 10px;
  }

  @media screen and (max-width: 970px) {
    margin: 0;
    padding: 0;
    grid-template-rows: repeat(auto-fill, 1fr);
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (max-width: 620px) {
    grid-template-rows: repeat(auto-fill, 1fr);
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 450px) {
    grid-template-rows: repeat(auto-fill, 1fr);
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Contents = styled.div`
  width: 100%;
  max-width: 240px;
  height: 200px;

  @media screen and (max-width: 450px) {
    width: 100%;
    height: 300px;
    max-width: 100%;
  }
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 70%;
  border: 1px solid;
  /* background-image: url(); */
  object-fit: cover;
`;

const Desc = styled.div`
  width: 100%;
  height: 30%;
  padding: 3px 0px;
  border: 1px solid; //나중에 지우기

  @media screen and (max-width: 450px) {
    padding-top: 6px;
    padding-left: 8px;
  }

  > .thumbnail_title {
    font-size: 12px;

    @media screen and (max-width: 450px) {
      margin-bottom: 4px;
      font-size: 14px;
    }
  }

  > .thumbnail_info {
    display: flex;
    height: 70%;

    > img {
      height: 100%;
      width: 36.4px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 4px;

      @media screen and (max-width: 450px) {
        width: 55.3px;
      }
    }

    > .thumbnail_info_name {
      > div {
        padding-top: 3px;
        font-size: 12px;

        @media screen and (max-width: 450px) {
          font-size: 14px;
        }
      }
    }
  }
`;

function MainContents() {
  return (
    <StyledMainContents>
      {Array(20)
        .fill("")
        .map((el, idx) => (
          <Contents key={idx}>
            <Thumbnail img={el.thumnail}></Thumbnail>
            <Desc>
              <div className="thumbnail_title">
                딸래미 시험 D-2 / 같이 공부해요 {/* el.title */}
              </div>
              <div className="thumbnail_info">
                <img src={defaultImg} alt="" /> {/*el.profileImg*/}
                <div
                  className="thumbnail_info_name"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div>김코딩{el.username}</div>
                  <div style={{ color: "#838080" }}>100명{el.viewer}</div>
                </div>
              </div>
            </Desc>
          </Contents>
        ))}
    </StyledMainContents>
  );
}

export default MainContents;
