import { useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { io } from "socket.io-client";
import { v4 } from "uuid";
import Chat from "../components/Chat";

const LiveVideo = styled.video`
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /*여기는 사파리*/
  -moz-transform: rotateY(180deg); /*이거는 파이어폭스*/
`;

const ChatSection = styled.section`
  width: 25%;
  height: 100%;
  min-height: 300px;

  @media screen and (max-width: 480px) {
    width: 100%;
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

  const connectToPeer = useCallback((socketId) => {
    //새 연결을 요청받으면 호출됨, 인자는 요청 보낸 소켓 id
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
    <div className="wrapper" style={{ display: "flex", height: "90vh" }}>
      <div className="Cam">
        <LiveVideo
          autoPlay
          playsInline
          undefined
          width="500"
          height="500"
          ref={localVideoRef}
        />
      </div>
      <ChatSection>
        <Chat
          socket={socketRef.current}
          viewers={viewers}
          uuid={uuidRef.current}
        />
      </ChatSection>
    </div>
  );
}

export default Streamer;
