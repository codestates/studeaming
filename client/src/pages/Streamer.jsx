import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { io } from "socket.io-client";
import { v4 } from "uuid";

const LiveVideo = styled.video`
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /*여기는 사파리*/
  -moz-transform: rotateY(180deg); /*이거는 파이어폭스*/
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
  const uuid = v4();
  const localVideoRef = useRef(HTMLVideoElement);
  const viewers = useRef([
    { id: id, username: username, profileImg: profileImg, socketId: "" },
  ]);

  useEffect(() => {
    let localStream;
    const socket = io("http://localhost:4000", {
      transports: ["websocket"],
      upgrade: false,
    });

    const peerConnection = new RTCPeerConnection(StunServer);

    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true,
      })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        localStream = stream;
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });
      });

    peerConnection.onicecandidate = (data) => {
      console.log(viewers.current);
      if (data.candidate) {
        socket.emit(
          "ice",
          data.candidate,
          uuid,
          viewers.current[viewers.current.length - 1].socketId
        );
      }
    };

    socket.emit("open_room", {
      uuid: uuid,
      id: id,
      title: state.title,
      thumbnail: state.thumbnail,
    });

    socket.on("welcome", async (viewerInfo) => {
      viewers.current[0].socketId = socket.id;
      viewers.current.push(viewerInfo);
      const offer = await peerConnection.createOffer();
      peerConnection.setLocalDescription(offer);
      socket.emit(
        "offer",
        offer,
        uuid,
        viewerInfo.socketId,
        socket.id,
        viewers.current
      );
    });

    socket.on("answer", (answer, socketId) => {
      peerConnection.setRemoteDescription(answer);
    });

    socket.on("ice", (ice, hostId) => {
      if (hostId === socket.id) {
        console.log("received candidate", ice);
        peerConnection.addIceCandidate(ice);
      }
    });

    socket.on("leave_room", (viewerId) => {
      viewers.current = viewers.current.filter(
        (viewer) => viewer.id !== viewerId
      );
    });

    peerConnection.oniceconnectionstatechange = (e) => {
      console.log("ice connected ", e);
    };

    return () => {
      socket.disconnect();
      localStream.getTracks()[0].stop();
      peerConnection.close();
    };
  }, []);

  return (
    <>
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
    </>
  );
}

export default Streamer;
