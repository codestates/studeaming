import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import defaultImg from "../assets/images/img_profile_default.svg";
import empty from "../assets/images/empty.png";

const StyledMainContents = styled.section`
  display: grid;
  place-items: center;
  max-width: 2000px;
  grid-template-rows: repeat(auto-fill, 1fr);
  grid-template-columns: repeat(5, 1fr);
  gap: 10px 10px;
  padding: 5px;

  @media screen and (max-width: 1480px) {
    grid-template-rows: repeat(auto-fill, 1fr);
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (max-width: 1130px) {
    grid-template-rows: repeat(auto-fill, 1fr);
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (max-width: 780px) {
    grid-template-rows: repeat(auto-fill, 1fr);
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 530px) {
    grid-template-rows: repeat(auto-fill, 1fr);
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Contents = styled.div`
  width: 100%;
  max-width: 360px;
  height: 100%;
  min-height: 320px;

  @media screen and (max-width: 530px) {
    max-width: 100%;
    height: 360px;
  }
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 70%;
  background-image: url(${(props) => props.img});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: 1px solid;

  @media screen and (max-width: 530px) {
    height: 75%;
  }
`;

const Desc = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 30%;
  padding: 6px;
  background-color: #f8f8f8;

  @media screen and (max-width: 530px) {
    height: 25%;
  }

  > .thumbnail_title {
    display: -webkit-box;
    height: 50px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
  }

  > .thumbnail_info {
    display: flex;
    align-items: center;
    height: 100%;

    > img {
      height: 45px;
      width: 45px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 4px;
    }

    > .thumbnail_info_name {
      padding: 2px;
      > div {
        padding: 3px;
        font-size: 14px;
      }
    }
  }
`;

const NoContents = styled.div`
  display: flex;
  flex-direction: column;
`;

function MainContents({ contents }) {
  const navigate = useNavigate();
  const navigateLanding = (el) => {
    navigate("/viewer", { state: el });
  };

  return (
    <StyledMainContents>
      {contents.length ? (
        contents.map((el, idx) => (
          <Contents
            key={idx}
            onClick={() => {
              navigateLanding(el);
            }}
          >
            <Thumbnail img={el.thumbnail} />
            <Desc>
              <div className="thumbnail_title">{el.title}</div>
              <div className="thumbnail_info">
                <img src={el.profileImg || defaultImg} alt="" />
                <div className="thumbnail_info_name">
                  <div style={{ fontWeight: "bold" }}>{el.username}</div>
                  <div style={{ color: "#838080" }}>{el.headCount}명</div>
                </div>
              </div>
            </Desc>
          </Contents>
        ))
      ) : (
        <NoContents>
          <h2>현재 스터디밍이 없습니다...</h2>
          <img src={empty} alt="" style={{ width: "100px" }} />
        </NoContents>
      )}
    </StyledMainContents>
  );
}

export default MainContents;
