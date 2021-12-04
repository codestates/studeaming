import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { modalOff } from "../store/actions";
import styled from "styled-components";
import { io } from "socket.io-client";
import MultiPlayer from "./MultiPlayer";
import defaultImg from "../assets/images/img_profile_default.svg";

const LiveVideo = styled.video`
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /*여기는 사파리*/
  -moz-transform: rotateY(180deg); /*이거는 파이어폭스*/
`;

const ProfileImg = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 16px;
  :hover {
    color: #f5f5f5;
  }
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 16px;
    object-fit: cover;
  }
  #remove_profile_img {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    /* top: 50%; */
    top: 0;
    left: 0;
    color: transparent;
    border-radius: 50%;
    font-size: 24px;
    :hover {
      transition: 0.3s;
      background-color: rgba(0, 0, 0, 0.3);
      color: #f5f5f5;
    }
  }
`;

const ImgLabel = styled.label`
  width: 100px;
  height: 100px;
  border: 1px dashed grey;
  border-radius: 50%;
  font-size: 12px;
  color: #8d8d8d;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 16px;
  + input {
    display: none;
  }
`;

function StreamerSetting() {
  //todo: 그냥 여기서부터 천천히 장치 호출이랑 다 해보자
  //todo: 여기는 상태 호출 및 uuid 호출
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [textInput, setTextInput] = useState("");
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
  const myAudio = new Audio();
  myAudio.src = "../../ASMR/Fire.mp3";

  socketRef.current = io.connect("http://localhost:4000", {
    //reconnectionDelay: 1000,
    //reconnection: true,
    transports: ["websocket"],
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

  const { profileImg } = useSelector(({ userReducer }) => userReducer);
  const [editInfo, setEditInfo] = useState({
    profileImg: profileImg || defaultImg,
  });
  const getProfileImg = (event) => {
    const src = event.target.files[0];
    setEditInfo({ ...editInfo, profileImg: URL.createObjectURL(src) });
  };
  const removeProfileImg = () => {
    setEditInfo({ ...editInfo, profileImg: null });
  };

  const navigateLanding = () => {
    setTextInput(textInput);
    socketRef.current.emit("join_room", {
      uuid: newID(),
      room: textInput,
      email: "sample@naver.com",
      thumbnail: editInfo.profileImg,
    });
    dispatch(modalOff());
    //navigate("../streamer");
  };

  const btnPlay = () => {
    myAudio().play();
  };
  const btnPause = () => {
    myAudio().pause();
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
      <div>ASMR을 선택해주세요</div>
      <MultiPlayer
        urls={["https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"]}
      ></MultiPlayer>
      <div> 방 제목을 입력해주세요 </div>
      <input
        placeholder="roomName"
        type="text"
        value={textInput}
        onChange={Findinput}
      />
      {editInfo.profileImg ? (
        <ProfileImg>
          <img src={editInfo.profileImg} />
          <div id="remove_profile_img">
            <span
              onClick={removeProfileImg}
              style={{ cursor: "pointer", fontSize: "24px" }}
            >
              &times;
            </span>
          </div>
        </ProfileImg>
      ) : (
        <div>
          <ImgLabel htmlFor="profile_img">프로필 업로드</ImgLabel>
          <input
            type="file"
            id="profile_img"
            accept="image/*"
            onChange={getProfileImg}
          ></input>
        </div>
      )}
      <div onClick={navigateLanding}>방송 시작</div>
    </>
  );
}

export default StreamerSetting;
