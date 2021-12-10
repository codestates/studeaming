import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { IoPeople } from "react-icons/io5";
import { BiFullscreen } from "react-icons/bi";
import { io } from "socket.io-client";
import { v4 } from "uuid";
import Chat from "../components/Chat";
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
  .wrapper {
    position: relative;
  }
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
  height: 100%;
  min-height: 300px;
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /*여기는 사파리*/
  -moz-transform: rotateY(180deg); /*이거는 파이어폭스*/

  @media screen and (max-width: 480px) {
    position: sticky;
    top: 0;
    z-index: 1010;
    height: 40%;
  }
`;

const FullScreen = styled(BiFullscreen)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: grey;
  z-index: 10;
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

  const { state } = useLocation();

  const uuidRef = useRef(v4());
  const localVideoRef = useRef(HTMLVideoElement);
  const localStreamRef = useRef();
  const pcRef = useRef({});
  const socketRef = useRef(
    io("http://localhost:4000", {
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
      });

    socket.on("connect", () => {
      viewers.current[0].socketId = socket.id;
    });

    socket.emit("open_room", {
      uuid: uuid,
      id: id,
      title: state.title,
      thumbnail: state.thumbnail,
    });

    socket.on("welcome", async (viewerInfo) => {
      const socketId = viewerInfo.socketId;
      viewers.current.push(viewerInfo);
      setCount(viewers.current.length);

      const pc = connectToPeer(socketId);
      pcRef.current = { ...pcRef.current, [socketId]: pc };

      const offer = await pc.createOffer();
      pc.setLocalDescription(offer);

      socket.emit("offer", offer, uuid, viewerInfo.socketId, socket.id);

      socket.emit("get_viewer", uuid, viewerInfo.socketId, viewers.current[0]);
    });

    socket.on("answer", (answer, socketId) => {
      pcRef.current[socketId].setRemoteDescription(answer);
    });

    socket.on("ice", (ice, hostId, socketId) => {
      if (hostId === socket.id) {
        console.log("received candidate", ice);
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
      socket.disconnect();
      localStreamRef.current.getTracks()[0].stop();
      Object.values(pcs).forEach((pc) => {
        pc.close();
      });
    };
  }, []);

  return (
    <StyledViewer>
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
        </Screen>

        <StudeamerInfo>
          <InfoSection1>
            <h3>{state.title}</h3>
            <div className="studeamer_info">
              <img src={state.profileImg || defaultImg} alt="" />
              <span>{state.username}</span>
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
        <Chat
          socket={socketRef.current}
          viewers={viewers}
          uuid={uuidRef.current}
        />
      </ChatSection>
    </StyledViewer>
  );
}

export default Streamer;
