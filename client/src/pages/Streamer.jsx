import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { IoPeople } from "react-icons/io5";
import { BiFullscreen } from "react-icons/bi";
import { GiSiren } from "react-icons/gi";
import Chat from "../components/Chat";
import FollowBtn from "../components/FollowBtn";
import defaultImg from "../assets/images/img_profile_default.svg";
import styled from "styled-components";

const StyledViewer = styled.section`
  width: 100%;
  height: calc(100vh - 61.7px);
  display: flex;
  padding: 20px;

  @media screen and (max-width: 480px) {
    flex-direction: column;
    padding: 0;
  }
`;

const ScreenSection = styled.section`
  width: 80vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-right: 20px;

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
  background-color: black;
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /*여기는 사파리*/
  -moz-transform: rotateY(180deg); /*이거는 파이어폭스*/

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

const Siren = styled(GiSiren)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const FullScreen = styled(BiFullscreen)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: grey;
`;

const StudeamerInfo = styled.div`
  width: 100%;
  height: 20%;
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

const ChatSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 25%;
  height: 100%;
  min-height: 300px;

  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;

const AsmrBox = styled.section`
  width: 100%;
  height: 100px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const Asmr = styled.div`
  margin: 5px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StunServer = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

function Streamer() {
  // todo: 방송시작하기를 눌러서 여기로 들어와 지면 여기서 랜더링이 시작되나?
  // todo: 셋팅에서 입력한 방제목, 썸네일, ASMR 이 필요한대 - 해결
  // todo: 여기서 useEffect안에 join_room를 비롯한 커넥션을 걸어주면 되고
  const { title, thumbnail, sound } = useSelector(
    ({ streamingReducer }) => streamingReducer
  );
  // console.log("타이틀과 썸네일과 사운드", thumbnail.profileImg);
  const { id } = useSelector(({ userReducer }) => userReducer);
  console.log("유저 아이디", id);
  const socketRef = useRef();
  const pcsRef = useRef(new RTCPeerConnection({ socketId: "" }));
  const localVideoRef = useRef(HTMLVideoElement);
  const localStreamRef = useRef(MediaStream);
  const [users, setUsers] = useState([
    { id: "", email: "", stream: MediaStream },
  ]);
  const studeamerInfo = {
    username: "김코딩",
    title: "새내기 기말고사 밤샘공부",
    profileImg: "",
    openedAt: 1234567,
    headCount: 1,
  };
  const [viewers, setViewers] = useState({});
  const asmr = ["불", "파도", "밤 풍경"];

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

  const createPeerConnection = useCallback((socketID, email) => {
    try {
      const pc = new RTCPeerConnection(StunServer);

      pc.onicecandidate = (e) => {
        if (!(socketRef.current && e.candidate)) return;
        console.log("onicecandidate");
        socketRef.current.emit("candidate", {
          candidate: e.candidate,
          candidateSendID: socketRef.current.id,
          candidateReceiveID: socketID,
        });
      };

      pc.oniceconnectionstatechange = (e) => {
        console.log(e);
      };

      pc.ontrack = (e) => {
        console.log("ontrack success");
        setUsers((oldUsers) =>
          oldUsers
            .filter((user) => user.id !== socketID)
            .concat({
              id: socketID,
              email: email,
              stream: e.streams[0],
            })
        );
      };
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000", {
      transports: ["websocket"],
      withCredentials: true,
    });
    getLocalStream();

    socketRef.current.on("user_exit", (data) => {
      const { id } = data;
      if (pcsRef.current[id]) return;
      console.log("셋팅유저가 나갈때", pcsRef.current);
      pcsRef.current[id].close();
      delete pcsRef.current[id];
      setUsers((oldUsers) => oldUsers.filter((user) => user.id !== id));
    });

    socketRef.current.emit("join_room", {
      studeamerID: id,
      roomName: title,
      thumbnail: thumbnail.profileImg,
    });
  });

  return (
    <>
      <StyledViewer>
        <ScreenSection>
          <Screen
            autoPlay
            playsInline
            undefined
            width="500"
            height="500"
            ref={localVideoRef}
          >
            <i>
              <Siren color="red" />
            </i>
            <i>
              <FullScreen />
            </i>
          </Screen>
          <StudeamerInfo>
            <InfoSection1>
              <h3>{studeamerInfo.title}</h3>
              <div className="studeamer_info">
                <img src={studeamerInfo.progileImg || defaultImg} alt="" />
                <span>{studeamerInfo.username}</span>
                <FollowBtn username={studeamerInfo.username} />
              </div>
            </InfoSection1>
            <InfoSection2>
              <span>오늘 공부 시작 시간</span>
              <div>
                <IoPeople size="12" />
                <span style={{ fontSize: "12px", marginLeft: "3px" }}>
                  공부중
                </span>
              </div>
            </InfoSection2>
          </StudeamerInfo>
        </ScreenSection>
        <ChatSection>
          <Chat />
          <AsmrBox>
            {asmr.map((el, idx) => (
              <Asmr key={idx}>{el}</Asmr>
            ))}
          </AsmrBox>
        </ChatSection>
      </StyledViewer>
      );
    </>
  );
}

export default Streamer;
