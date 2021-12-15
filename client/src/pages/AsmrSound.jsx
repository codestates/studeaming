import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { IoPeople } from "react-icons/io5";
import { ImVolumeMedium, ImVolumeMute2 } from "react-icons/im";
import { io } from "socket.io-client";
import Chat from "../components/Chat";
import sound from "../assets/sound";
import defaultImg from "../assets/images/img_profile_default.svg";
import night from "../assets/images/fire2.jpg";

const StyledAsmrSound = styled.div`
  width: 100%;
  height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  padding: 20px;

  @media screen and (max-width: 480px) {
    height: calc(100vh - 60px);
  }
`;

const Container = styled.div`
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: center;

  @media screen and (max-width: 1000px) {
    width: 100%;
    flex-direction: column;
    justify-content: start;
    padding: 0;
  }
`;

const ScreenSection = styled.section`
  width: 100%;
  max-width: 1280px;
  min-width: 640px;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-right: 20px;

  @media screen and (max-width: 1000px) {
    width: 100%;
    min-width: 330px;
    height: 100%;
    margin: 0;
  }
`;

const Screen = styled.div`
  width: 100%;
  max-width: 1280px;
  min-width: 360px;
  height: 100%;
  min-height: 240px;
  position: relative;
  background-color: black;

  @media screen and (max-width: 1000px) {
    width: 100%;
    height: 100%;
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

const Volume = styled(ImVolumeMedium)`
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  z-index: 10;
`;

const Mute = styled(ImVolumeMute2)`
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  z-index: 10;
`;

const Img = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.img});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const StudeamerInfo = styled.div`
  max-width: 1280px;
  min-width: 360px;
  width: 100%;
  height: 15%;
  min-height: 150px;
  display: flex;
  justify-content: space-between;
  padding: 20px 10px;
  /* background-color: #f8f8f8; */
`;

const InfoSection1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 4px;

  > .stream_title {
    display: -webkit-box;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-black-50);
    margin: 0;
    line-height: 1.2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
  }

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
  justify-content: end;
  color: #838080;
  min-width: 120px;

  > span {
    display: inline-block;
    font-size: 12px;
  }
`;

const ChatSection = styled.section`
  width: 350px;
  min-width: 300px;
  height: 100%;
  min-height: 300px;

  @media screen and (max-width: 1000px) {
    width: 100%;
    min-width: 360px;
  }
`;

function AsmrSound() {
  const { id, username, profileImg } = useSelector(
    ({ userReducer }) => userReducer
  );

  const { state } = useLocation();
  // console.log(state);
  // const idx = Number(state.uuid);

  const [isMute, setIsMute] = useState(false);
  const audioRef = useRef(HTMLAudioElement);

  const muteHandler = () => {
    setIsMute(!isMute);
  };

  const socketRef = useRef(
    io(process.env.REACT_APP_BASE_URL, {
      transports: ["websocket"],
      upgrade: false,
    })
  );
  const viewers = useRef([{ id, username, profileImg }]);

  const [count, setCount] = useState(viewers.current.length);

  useEffect(() => {
    const socket = socketRef.current;

    socket.on("connect", () => {
      viewers.current[0].socketId = socket.id;
      socket.emit("join_room", {
        id,
        username,
        profileImg,
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

  //todo: 오디오 무한재생부분 및 페이지 아웃시 음악 일시정지
  useEffect(() => {
    audioRef.current.addEventListener("ended", () => {
      audioRef.current.loop = true;
      audioRef.current.play();
    });
    audioRef.current.volume = 0.1;
  }, []);

  useEffect(() => {
    if (!isMute) audioRef.current.play();
    else audioRef.current.pause();
  }, [isMute]);

  return (
    <StyledAsmrSound>
      <audio
        autoPlay
        src={`assets/sound/${state.uuid}.mp3`}
        preload="auto"
        ref={audioRef}
      />
      <Container>
        <ScreenSection>
          <Screen>
            <Img img={`assets/images/${state.uuid}.jpg`} />
            <i onClick={muteHandler}>{isMute ? <Mute /> : <Volume />}</i>
          </Screen>
          <StudeamerInfo>
            <InfoSection1>
              <span className="stream_title">ASMR👂 Study With Me🔥 </span>
              <div className="studeamer_info">
                <img src={defaultImg} alt="" />
                <span>Studeaming</span>
              </div>
            </InfoSection1>
            <InfoSection2>
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
          <Chat
            socket={socketRef.current}
            viewers={viewers}
            uuid={state.uuid}
          />
        </ChatSection>
      </Container>
    </StyledAsmrSound>
  );
}

export default AsmrSound;
