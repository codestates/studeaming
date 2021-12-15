import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoPeople } from "react-icons/io5";
import defaultImg from "../assets/images/img_profile_default.svg";
import empty from "../assets/images/empty.png";
import studyroomAPI from "../api/studyroom";
import { notification } from "antd";
import "antd/dist/antd.css";

const StyledMainContents = styled.section`
  display: grid;
  place-items: center;
  max-width: 2000px;
  grid-template-rows: repeat(auto-fill, 1fr);
  grid-template-columns: repeat(5, 1fr);
  gap: 20px 20px;
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
  min-height: 340px;

  :hover {
    cursor: pointer;
    transform: scale(1.01);
  }

  @media screen and (max-width: 530px) {
    max-width: 100%;
    height: 360px;
  }
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 70%;
  background-image: url(${(props) => props.img});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const Desc = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 30%;
  padding: 10px;
  background-color: var(--color-gray-bg);

  > .thumbnail_title {
    display: -webkit-box;
    line-height: 1.2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--color-black);
  }

  > .thumbnail_info {
    display: flex;
    align-items: center;
    height: 50%;
    position: relative;

    > img {
      height: 45px;
      width: 45px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 4px;
    }

    > .thumbnail_info_name {
      padding-left: 4px;
      display: flex;
      flex-direction: column;

      > div {
        font-size: 12px;
      }
    }

    > .time_info {
      position: absolute;
      font-size: 12px;
      right: 0;
      bottom: 0;
      color: var(--color-black-25);
    }
  }
`;

const NoContents = styled.div`
  display: flex;
  flex-direction: column;
`;

function MainContents({ contents }) {
  const now = Date.now() / (60 * 1000);
  const navigate = useNavigate();
  const refreshPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  const navigateLanding = (el) => {
    if (el.user_id === "0") {
      navigate("/asmrsound", { state: el });
    } else {
      studyroomAPI
        .getStudyRoom()
        .then((res) => {
          const roomInfo = res.data.roomList.filter(
            (room) => room.uuid === el.uuid
          );
          if (!roomInfo.length) {
            notification.warning({
              message: (
                <div style={{ fontSize: "1rem" }}>종료된 방송입니다.</div>
              ),
            });
            refreshPage();
          } else if (roomInfo[0].headCount < 5) {
            navigate("/viewer", { state: el });
          } else {
            notification.warning({
              message: (
                <div style={{ fontSize: "1rem" }}>
                  입장 가능 인원이 초과되었습니다.
                </div>
              ),
            });
            refreshPage();
          }
        })
        .catch(() => {});
    }
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
            <Thumbnail img={el.thumbnail ? el.thumbnail : empty} />
            <Desc>
              <div className="thumbnail_title">{el.title}</div>
              <div className="thumbnail_info">
                <img src={el.profileImg || defaultImg} alt="" />
                <div className="thumbnail_info_name">
                  <div style={{ color: "var(--color-black-50)" }}>
                    {el.username}
                  </div>
                  <div
                    style={{ color: "#838080", display: "flex", gap: "3px" }}
                  >
                    <IoPeople />
                    {el.user_id === "0"
                      ? ` ${el.headCount}`
                      : ` ${el.headCount} / 4`}
                  </div>
                </div>
                <div className="time_info">
                  {el.user_id === "0"
                    ? null
                    : now - el.createdAt > 60
                    ? `${Math.floor(
                        (now - el.createdAt) / 60
                      )}시간 ${Math.floor((now - el.createdAt) % 60)}분 전`
                    : Math.floor(now - el.createdAt) >= 1
                    ? `${Math.floor(now - el.createdAt)}분 전`
                    : "방금 전"}
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
