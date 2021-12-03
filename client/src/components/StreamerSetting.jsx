import Screen from "./Screen";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { modalOff } from "../store/actions";

function StreamerSetting() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [textInput, setTextInput] = useState("");

  const navigateLanding = () => {
    dispatch(modalOff());
    navigate("../streamer");
  };

  //todo: 그냥 여기서부터 천천히 장치 호출이랑 다 해보자
  //todo: 여기는 상태 호출 및 uuid 호출
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

  // todo : Media 스트림 설정
  // todo : 여기서는 장치만 호출하고 사용자들과 커넥션을 할 필요는 없음
  // todo : 여기서 호출된 장치들의 데이터만 streamer로 전달하면 될꺼 같은데
  export const getLocalStream = useCallback(async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: 400,
          height: 400,
        },
      });
      localStreamRef.current = localStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      if (!socketRef.current) return;
      console.log("방제목", textInput);
      socketRef.current.emit("join_room", {
        uuid: newID(),
        room: textInput,
        email: "sample@naver.com",
      });
    } catch (e) {
      console.log(`getUserMedia error: ${e}`);
    }
  }, []);

  //todo: 함수모음집
  const Findinput = (data) => {
    setTextInput(data.target.value);
  };

  return (
    <>
      <Screen />
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
