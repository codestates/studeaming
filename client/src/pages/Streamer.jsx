import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { IoPeople } from "react-icons/io5";
import { BiFullscreen } from "react-icons/bi";
import { ImVolumeMedium, ImVolumeMute2 } from "react-icons/im";
import { io } from "socket.io-client";
import { v4 } from "uuid";
import Chat from "../components/Chat";
import defaultImg from "../assets/images/img_profile_default.svg";
import { notification } from "antd";
import "antd/dist/antd.css";

const StyledStreamer = styled.div`
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

const Cam = styled.video`
  width: 100%;
  height: 100%;
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /*여기는 사파리*/
  -moz-transform: rotateY(180deg); /*이거는 파이어폭스*/
`;

const FullScreen = styled(BiFullscreen)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: grey;
  z-index: 10;
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

const StudeamerInfo = styled.div`
  max-width: 1280px;
  min-width: 360px;
  width: 100%;
  height: 15%;
  min-height: 150px;
  display: flex;
  justify-content: space-between;
  padding: 20px 10px;
  background-color: #f8f8f8;
`;

const InfoSection1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  > .stream_title {
    display: -webkit-box;
    font-size: 1.2rem;
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

const InfoSection2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: space-between;
  color: #838080;
  min-width: 120px;

  > span {
    display: inline-block;
    font-size: 12px;
  }
`;

const StunServer = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
      ],
    },
  ],
};

function Streamer() {
  const { id, username, profileImg } = useSelector(
    ({ userReducer }) => userReducer
  );
  const {
    state: { title, thumbnail, sound, createdAt },
  } = useLocation();
  const uuidRef = useRef(v4());
  const localVideoRef = useRef(HTMLVideoElement);
  const localStreamRef = useRef();
  const pcRef = useRef({});
  const socketRef = useRef(
    io(process.env.REACT_APP_BASE_URL, {
      transports: ["websocket"],
      upgrade: false,
    })
  );
  const viewers = useRef([{ id, username, profileImg }]);
  const audioRef = useRef(HTMLAudioElement);
  const [count, setCount] = useState(viewers.current.length);
  const [isMute, setIsMute] = useState(false);
  const date = new Date(createdAt);
  const time = `${date.getHours()} : ${date.getMinutes()}`;

  //todo: 추가
  const [ReallyOut, setReallyOut] = useState(true);

  const muteHandler = () => {
    setIsMute(!isMute);
  };

  const connectToPeer = useCallback((socketId) => {
    const peerConnection = new RTCPeerConnection(StunServer);

    peerConnection.onicecandidate = (data) => {
      if (!socketRef.current || !data.candidate) return;
      socketRef.current.emit(
        "ice",
        data.candidate,
        uuidRef.current,
        socketId,
        socketRef.current.id
      );
    };

    localStreamRef.current.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStreamRef.current);
    });

    peerConnection.oniceconnectionstatechange = (e) => {
      console.log("ice connected ", e);
    };

    return peerConnection;
  }, []);

  useEffect(() => {
    const uuid = uuidRef.current;
    const socket = socketRef.current;
    const pcs = pcRef.current;

    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true,
      })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        localStreamRef.current = stream;
      })
      .catch((err) => {
        //카메라 불러오지 못함
      });

    socket.on("connect", () => {
      viewers.current[0].socketId = socket.id;
    });

    socket.emit("open_room", { uuid, id, title, thumbnail });

    socket.on("welcome", async (viewerInfo) => {
      const socketId = viewerInfo.socketId;
      viewers.current.push(viewerInfo);
      setCount(viewers.current.length);

      const pc = connectToPeer(socketId);
      pcRef.current = { ...pcRef.current, [socketId]: pc };

      const offer = await pc.createOffer();
      pc.setLocalDescription(offer);

      socket.emit("offer", offer, uuid, viewerInfo.socketId, socket.id, sound);

      socket.emit("get_viewer", uuid, viewerInfo.socketId, viewers.current[0]);
    });

    socket.on("answer", (answer, socketId) => {
      pcRef.current[socketId].setRemoteDescription(answer);
    });

    socket.on("ice", (ice, hostId, socketId) => {
      if (hostId === socket.id) {
        pcRef.current[socketId].addIceCandidate(ice);
      }
    });

    socket.on("leave_room", (socketId) => {
      viewers.current = viewers.current.filter(
        (viewer) => viewer.socketId !== socketId
      );
      setCount(viewers.current.length);

      pcRef.current[socketId].close();
      delete pcRef.current[socketId];
    });

    socket.on("update_viewer", (updatedViewer) => {
      viewers.current.forEach((viewer) => {
        if (viewer.socketId === updatedViewer.socketId) {
          viewer.id = updatedViewer.id;
          viewer.username = updatedViewer.username;
          viewer.profileImg = updatedViewer.profileImg;
        }
      });
    });

    return () => {
      notification.warning({
        message: (
          <div style={{ fontSize: "1rem" }}>방송이 종료 되었습니다.</div>
        ),
      });
      socket.disconnect();
      localStreamRef.current.getTracks()[0].stop();
      Object.values(pcs).forEach((pc) => {
        pc.close();
      });
    };
  }, []);

  useEffect(() => {
    audioRef.current.addEventListener("ended", () => {
      audioRef.current.loof = true;
      audioRef.current.play();
    });
    audioRef.current.volume = 0.1;
  }, []);

  useEffect(() => {
    if (!isMute) audioRef.current.play();
    else audioRef.current.pause();
  }, [isMute]);

  return (
    <StyledStreamer>
      <audio
        autoPlay
        src={`/assets/sound/${sound}.mp3`}
        preload="auto"
        ref={audioRef}
      />
      <Container>
        <ScreenSection>
          <Screen>
            <Cam ref={localVideoRef} autoPlay playsInline undefined />
            <i
              onClick={() => {
                localVideoRef.current.requestFullscreen();
              }}
            >
              <FullScreen />
            </i>
            {isMute ? (
              <i>
                <Mute onClick={muteHandler} />
              </i>
            ) : (
              <i>
                <Volume onClick={muteHandler} />
              </i>
            )}
          </Screen>
          <StudeamerInfo>
            <InfoSection1>
              <span className="stream_title">{title}</span>
              <div className="studeamer_info">
                <img src={profileImg || defaultImg} alt="" />
                <span>{username}</span>
              </div>
            </InfoSection1>
            <InfoSection2>
              <span style={{ textAlign: "right" }}>
                공부 시작 시간 <br />
                {time}
              </span>
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
            uuid={uuidRef.current}
          />
        </ChatSection>
      </Container>
    </StyledStreamer>
  );
}

export default Streamer;
