import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { modalOff } from "../store/actions";
import styled from "styled-components";
import { io } from "socket.io-client";

export const LiveVideo = styled.video`
  transform: rotateY(180deg);
  webkit-transform: rotateY(180deg); *여기는 사파리*
  moz-transform: rotateY(180deg); *이거는 파이어폭스*
`;

function StreamerSetting() {
  //todo: 그냥 여기서부터 천천히 장치 호출이랑 다 해보자
  //todo: 여기는 상태 호출 및 uuid 호출
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [textInput, setTextInput] = useState("");
  console.log("방제목", textInput);
  const pcsRef = useRef(new RTCPeerConnection({ socketId: "" }));
  const localVideoRef = useRef(HTMLVideoElement);
  let localStreamRef = useRef(MediaStream);
  const socketRef = useRef();
  const [users, setUsers] = useState([
    { id: "", email: "", stream: MediaStream },
  ]);
  const newID = function () {
    return Math.random().toString(36).substr(2, 16);
  };

  socketRef.current = io.connect("http://localhost:4000", {
    //reconnectionDelay: 1000,
    //reconnection: true,
    transports: ["polling"],
    forceNew: true,
    withCredentials: true,
  });

  // todo : Media 스트림 설정
  // todo : 여기서는 장치만 호출하고 사용자들과 커넥션을 할 필요는 없음
  // todo : 여기서 호출된 장치들의 데이터만 streamer로 전달하면 될꺼 같은데

  const getLocalStream = useCallback(async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: 800,
          height: 800,
        },
      });
      localStreamRef.current = localStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      if (!socketRef.current) return;
    } catch (e) {
      console.log(`getUserMedia error: ${e}`);
    }
  }, []);

  useEffect(() => {
    getLocalStream();
  }, []);

  //todo: 함수모음집
  const Findinput = (data) => {
    setTextInput(data.target.value);
  };

  const navigateLanding = () => {
    setTextInput(textInput);
    console.log("네비게이터랜딩", textInput);
    socketRef.current.emit("join_room", {
      uuid: newID(),
      room: textInput,
      email: "sample@naver.com",
    });
    dispatch(modalOff());
    navigate("../streamer");
  };

  return (
    <>
      <div className="Cam">
        <LiveVideo
          autoPlay
          playsInline
          width="500"
          height="500"
          ref={localVideoRef}
        />
      </div>
      <button onClick={navigateLanding}>방송 시작</button>
      <input
        placeholder="roomName"
        type="text"
        value={textInput}
        onChange={Findinput}
      />
    </>
  );
}

export default StreamerSetting;
