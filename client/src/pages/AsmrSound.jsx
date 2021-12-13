import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { IoPeople } from "react-icons/io5";
import { BiFullscreen } from "react-icons/bi";
import { io } from "socket.io-client";
import Chat from "../components/Chat";
import sound from "../assets/sound";
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

function AsmrSound() {
  const asmr = ["불", "파도", "밤 풍경"];
  const index = 1;

  //todo: 오디오 부분
  const audio = new Audio();
  audio.currentTime = 0;
  audio.src = "../assets/sound/night.mp3";
  audio.volume = 0.2;

  const { id, username, profileImg } = useSelector(
    ({ userReducer }) => userReducer
  );

  const { state } = useLocation();
  console.log("state", state);

  const socketRef = useRef(
    io(process.env.REACT_APP_BASE_URL, {
      transports: ["websocket"],
      upgrade: false,
    })
  );
  const viewers = useRef([
    {
      id: id,
      username: username,
      profileImg: profileImg,
    },
  ]);

  const [count, setCount] = useState(viewers.current.length);

  useEffect(() => {
    const socket = socketRef.current;

    socket.on("connect", () => {
      viewers.current[0].socketId = socket.id;
      socket.emit("join_room", {
        id: id,
        username: username,
        profileImg: profileImg,
        socketId: socket.id,
        uuid: state.uuid,
      });
    });

    socket.on("welcome", (viewerInfo) => {
      if (viewerInfo.socketId !== socket.id) {
        //새로운 참가자가 있는 경우 뷰어 목록에 추가하고 내 정보 보내줌
        viewers.current.push(viewerInfo);
        setCount(viewers.current.length);
        socket.emit(
          "get_viewer",
          state.uuid,
          viewerInfo.socketId,
          viewers.current[0]
        );
      }
    });

    socket.on("get_viewer", (requestId, viewerInfo) => {
      if (requestId === socket.id) {
        //새로 들어온 유저가 나라면 수신한 다른 유저들의 정보를 저장
        viewers.current.push(viewerInfo);
      }
      setCount(viewers.current.length);
    });

    socket.on("leave_room", (socketId) => {
      viewers.current = viewers.current.filter(
        (viewer) => viewer.socketId !== socketId
      );
      setCount(viewers.current.length);
    });

    socket.on("update_viewer", (updatedViewer) => {
      console.log("update_viewer");
      viewers.current.forEach((viewer) => {
        if (viewer.socketId === updatedViewer.socketId) {
          viewer.id = updatedViewer.id;
          viewer.username = updatedViewer.username;
          viewer.profileImg = updatedViewer.profileImg;
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const updatedUser = {
      id: id,
      username: username,
      profileImg: profileImg,
      socketId: socketRef.current.id,
    };

    viewers.current.forEach((viewer) => {
      if (viewer.socketId === socketRef.current.id) {
        viewer.id = id;
        viewer.username = username;
        viewer.profileImg = profileImg;
      }
    });

    socketRef.current.emit("update_viewer", state.uuid, updatedUser);
  }, [id, username, profileImg]);

  //todo: 오디오 부분
  useEffect(() => {
    audio.addEventListener("ended", () => {
      audio.loop = true;
      audio.play();
    });
    audio.play();
  }, []);

  return (
    <StyledViewer>
      <ScreenSection>
        <Screen>
          <i>
            <FullScreen />
          </i>
        </Screen>
        <StudeamerInfo>
          <InfoSection1>
            <h3>{"ASMR👂 Study With Me🔥"}</h3>
            <div className="studeamer_info">
              <img src={defaultImg} alt="" />
              <span>{"Studeaming"}</span>
            </div>
          </InfoSection1>
          <InfoSection2>
            <span>오늘 공부 시작 시간</span>
            <div>
              <IoPeople size="12" />
              <span style={{ fontSize: "12px", marginLeft: "3px" }}>
                {count}명 공부중
              </span>
            </div>
          </InfoSection2>
        </StudeamerInfo>
      </ScreenSection>
      <ChatSection>
        <Chat socket={socketRef.current} viewers={viewers} uuid={state.uuid} />
        <AsmrBox>
          {asmr.map((el, idx) => (
            <Asmr key={idx}>{el}</Asmr>
          ))}
        </AsmrBox>
      </ChatSection>
    </StyledViewer>
  );
}

export default AsmrSound;
