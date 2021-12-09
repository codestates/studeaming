import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { reportModalOpen } from "../store/actions/index";
import { IoPeople } from "react-icons/io5";
import { BiFullscreen } from "react-icons/bi";
import { GiSiren } from "react-icons/gi";
import { io } from "socket.io-client";
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
  .wrapper {
    position: relative;
  }
  @media screen and (max-width: 480px) {
    width: 100%;
    height: 100%;
    margin: 0;
  }
`;

const Screen = styled.video`
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
  const { id, username } = useSelector(({ userReducer }) => userReducer);
  const viewers = useRef([]);
  const peerVideoRef = useRef(HTMLVideoElement);
  const dispatch = useDispatch();
  const { state } = useLocation();

  useEffect(() => {
    const peerConnection = new RTCPeerConnection(StunServer); //rtc 커넥션 객체를 만듦

    const socket = io("http://localhost:4000", {
      transports: ["websocket"],
      upgrade: false,
    });

    peerConnection.onicecandidate = (data) => {
      //icecandidate 준비가 되었을 때 소켓 이벤트를 발생
      if (data.candidate) {
        socket.emit(
          "ice",
          data.candidate,
          state.uuid,
          viewers.current[0].socketId
        );
      }
    };

    socket.on("connect", () => {
      //웹소켓으로 연결되면
      console.log("connect", socket.id);
      socket.emit("join_room", {
        //join_room 이벤트 발생
        id: id,
        username: username,
        socketId: socket.id,
        uuid: state.uuid,
      });
    });

    socket.on("welcome", (viewer) => {
      viewers.current.push(viewer);
    });

    socket.on("offer", async (offer, socketId, hostId) => {
      if (socketId === socket.id) {
        viewers.current.push({ socketId: hostId });
        peerConnection.setRemoteDescription(offer);
        const answer = await peerConnection.createAnswer();
        peerConnection.setLocalDescription(answer);
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

    peerConnection.ontrack = (data) => {
      console.log("received stream", data.streams[0]);
      peerVideoRef.current.srcObject = data.streams[0];
      //peerVideoRef.current.play();
    };

    peerConnection.oniceconnectionstatechange = (e) => {
      console.log("ice connected ", e);
    };
  }, []);

  return (
    <StyledViewer>
      <ScreenSection>
        <Screen>
          <Cam ref={peerVideoRef} />
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
