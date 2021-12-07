import { useState } from "react";
import styled from "styled-components";
import { IoPeople } from "react-icons/io5";
import { BiFullscreen } from "react-icons/bi";
import { GiSiren } from "react-icons/gi";
// import Screen from "../components/Screen";
import Chat from "../components/Chat";
import FollowBtn from "../components/FollowBtn";
import defaultImg from "../assets/images/img_profile_default.svg";

const StyledViewer = styled.section`
  width: 100%;
  height: calc(100vh - 61.7px);
  display: flex;
  padding: 20px;

  @media screen and (max-width: 480px) {
    flex-direction: column;
    padding: 0;
  }
`;

const ScreenSection = styled.section`
  width: 80vw;
  height: 100%;
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
  height: 20%;
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

const ChatSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 25%;
  height: 100%;
  min-height: 300px;

  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;

const AsmrBox = styled.section`
  width: 100%;
  height: 100px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const Asmr = styled.div`
  margin: 5px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function StreamerMockup() {
  const studeamerInfo = {
    username: "김코딩",
    title: "새내기 기말고사 밤샘공부",
    profileImg: "",
    openedAt: 1234567,
    headCount: 1,
  };
  const [viewers, setViewers] = useState({});
  const asmr = ["불", "파도", "밤 풍경"];

  return (
    <StyledViewer>
      <ScreenSection>
        <Screen>
          <i>
            <Siren color="red" />
          </i>
          <i>
            <FullScreen />
          </i>
        </Screen>
        <StudeamerInfo>
          <InfoSection1>
            <h3>{studeamerInfo.title}</h3>
            <div className="studeamer_info">
              <img src={studeamerInfo.progileImg || defaultImg} alt="" />
              <span>{studeamerInfo.username}</span>
              <FollowBtn username={studeamerInfo.username} />
            </div>
          </InfoSection1>
          <InfoSection2>
            <span>오늘 공부 시작 시간</span>
            <div>
              <IoPeople size="12" />
              <span style={{ fontSize: "12px", marginLeft: "3px" }}>
                공부중
              </span>
            </div>
          </InfoSection2>
        </StudeamerInfo>
      </ScreenSection>
      <ChatSection>
        <Chat />
        <AsmrBox>
          {asmr.map((el, idx) => (
            <Asmr key={idx}>{el}</Asmr>
          ))}
        </AsmrBox>
      </ChatSection>
    </StyledViewer>
  );
}

export default StreamerMockup;
