import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { reportModalOpen } from "../store/actions/index";
import { IoPeople } from "react-icons/io5";
import { BiFullscreen } from "react-icons/bi";
import { GiSiren } from "react-icons/gi";
// import Screen from "../components/Screen";
import Chat from "../components/Chat";
import FollowBtn from "../components/FollowBtn";
import defaultImg from "../assets/images/img_profile_default.svg";

const StyledViewer = styled.section`
  width: 100%;
  height: calc(100vh - 69.28px);
  display: flex;
  padding: 20px;
  @media screen and (max-width: 480px) {
    flex-direction: column;
    padding: 0;
  }
`;

const ScreenSection = styled.section`
  width: 80vw;
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  position: relative;
  margin-right: 20px;
  @media screen and (max-width: 480px) {
    width: 100%;
    height: 100%;
    margin: 0;
  }
`;

const Screen = styled.div`
  width: 100%;
  min-width: 360px;
  height: 80%;
  min-height: 300px;
  border: 1px solid;
  position: relative;
  background-color: black;

  @media screen and (max-width: 480px) {
    position: sticky;
    top: 0;
    z-index: 1010;
    height: 40%;
  }

  > i {
    visibility: hidden;
    cursor: pointer;
  }
  :hover {
    > i {
      visibility: visible;
    }
  }
`;

const Cam = styled.video`
  width: 100%;
  min-width: 360px;
  height: 80%;
  min-height: 300px;

  @media screen and (max-width: 480px) {
    position: sticky;
    top: 0;
    z-index: 1010;
    height: 40%;
  }
`;

const Siren = styled(GiSiren)`
  position: absolute;
  top: 10px;
  right: 10px;
`;
const FullScreen = styled(BiFullscreen)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: grey;
`;

const StudeamerInfo = styled.div`
  width: 100%;
  height: 15%;
  min-height: 100px;
  display: flex;
  justify-content: space-between;
  padding: 20px 10px;
  background-color: #f8f8f8;
`;

const InfoSection1 = styled.div`
  display: flex;
  flex-direction: column;

  > .studeamer_info {
    display: flex;
    align-items: center;

    > img {
      height: 45px;
      width: 45px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 10px;
    }
    > span {
      display: inline-block;
      vertical-align: middle;
      line-height: normal;
    }
  }
`;

const ChatSection = styled.section`
  width: 25%;
  height: 100%;
  min-height: 300px;

  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;

const InfoSection2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: space-between;
  color: #838080;
  > span {
    display: inline-block;
    font-size: 12px;
  }
`;

function Viewer() {
  const dispatch = useDispatch();
  const { state } = useLocation();

  return (
    <StyledViewer>
      <ScreenSection>
        <Screen>
          {/* <Cam ref={localVideoRef} /> 여기에 송출 화면 속성 넣으면 됨*/}
          <i
            onClick={() => {
              dispatch(reportModalOpen(true, state.username));
            }}
          >
            <Siren color="red" />
          </i>
          <i
          // onClick={() => {
          //   localVideoRef.current.requestFullscreen();
          // }}
          >
            <FullScreen />
          </i>
        </Screen>
        <StudeamerInfo>
          <InfoSection1>
            <h3>{state.title}</h3>
            <div className="studeamer_info">
              <img src={state.profileImg || defaultImg} alt="" />
              <span>{state.username}</span>
              <FollowBtn username={state.username} />
            </div>
          </InfoSection1>
          <InfoSection2>
            <span>오늘 공부 시작 시간</span>
            <div>
              <IoPeople size="12" />
              <span style={{ fontSize: "12px", marginLeft: "3px" }}>
                {state.headCount}명 공부중
              </span>
            </div>
          </InfoSection2>
        </StudeamerInfo>
      </ScreenSection>
      <ChatSection>
        <Chat />
      </ChatSection>
    </StyledViewer>
  );
}

export default Viewer;
