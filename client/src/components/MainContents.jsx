import styled from "styled-components";
import defaultImg from "../assets/images/img_profile_default.svg";

const StyledMainContents = styled.section`
  display: grid;
  place-items: center;
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
    display: inline-block;
    max-width: 360px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    white-space: normal;
    height: 45px;
    text-align: left;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
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

function MainContents({ contents }) {
  return (
    <StyledMainContents>
      {contents.map((el, idx) => (
        <Contents key={idx}>
          <Thumbnail img={el.thumbnail} />
          <Desc>
            <div className="thumbnail_title">{el.title}</div>
            <div className="thumbnail_info">
              <img src={el.progileImg || defaultImg} alt="" />
              <div className="thumbnail_info_name">
                <div style={{ fontWeight: "bold" }}>{el.username}</div>
                <div style={{ color: "#838080" }}>{el.viewer}명</div>
              </div>
            </div>
          </Desc>
        </Contents>
      ))}
    </StyledMainContents>
  );
}

export default MainContents;
