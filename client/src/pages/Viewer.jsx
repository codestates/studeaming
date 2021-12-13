import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { reportModalOpen } from "../store/actions/index";
import { IoPeople } from "react-icons/io5";
import { BiFullscreen } from "react-icons/bi";
import { GiSiren } from "react-icons/gi";
import { io } from "socket.io-client";
import Chat from "../components/Chat";
import sound from "../assets/sound";
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
  background-color: var(--color-black);

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

const Siren = styled(GiSiren)`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
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

function Viewer({ route, navigation }) {
  const { id, username, profileImg } = useSelector(
    ({ userReducer }) => userReducer
  );

  const dispatch = useDispatch();

  const { state } = useLocation();

  const peerVideoRef = useRef(HTMLVideoElement);
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
    const peerConnection = new RTCPeerConnection(StunServer); //rtc 커넥션 객체를 만듦
    const socket = socketRef.current;
    const audio = new Audio();

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
        setCount(viewers.current.length);
      }
    });

    socket.on("offer", async (offer, socketId, hostId, soundIdx) => {
      if (socketId === socket.id) {
        peerConnection.onicecandidate = (data) => {
          if (data.candidate) {
            socket.emit(
              "ice",
              data.candidate,
              state.uuid,
              hostId, //ice 받을 소켓
              socket.id
            );
          }
        };

        peerConnection.setRemoteDescription(offer);
        const answer = await peerConnection.createAnswer();
        peerConnection.setLocalDescription(answer);

        if (soundIdx) {
          audio.src = sound[soundIdx].url;
          audio.volume = 0.1;
          audio.play();
        }

        socket.emit("answer", answer, state.uuid, socket.id);
      } else return;
    });

    socket.on("ice", (ice, socketId) => {
      console.log(socket.id, socketId);
      if (socket.id === socketId) {
        console.log("received candidate", ice);
        peerConnection.addIceCandidate(ice);
      } else return;
    });

    socket.on("leave_room", (socketId) => {
      viewers.current = viewers.current.filter(
        (viewer) => viewer.socketId !== socketId
      );
      setCount(viewers.current.length);
    });

    socket.on("close_room", () => {
      socket.disconnect();
      peerConnection.close();
    });

    peerConnection.ontrack = (data) => {
      console.log("received stream", data.streams[0]);
      peerVideoRef.current.srcObject = data.streams[0];
    };

    peerConnection.oniceconnectionstatechange = (e) => {
      console.log("ice connected ", e, peerConnection.connectionState);
    };

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
      audio.pause();
      socket.disconnect();
      if (peerConnection) {
        peerConnection.close();
      }
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

  return (
    <StyledViewer>
      <ScreenSection>
        <Screen>
          <Cam ref={peerVideoRef} autoPlay playsInline undefined />
          <i
            onClick={() => {
              dispatch(reportModalOpen(true, state.username));
            }}
          >
            <Siren color="red" />
          </i>
          <i
            onClick={() => {
              peerVideoRef.current.requestFullscreen();
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
              <FollowBtn username={state.username} />
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
      </ChatSection>
    </StyledViewer>
  );
}

export default Viewer;
