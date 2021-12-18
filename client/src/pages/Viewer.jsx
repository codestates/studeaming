import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { profileModalOpen, reportModalOpen } from "../store/actions/index";
import { IoPeople } from "react-icons/io5";
import { BiFullscreen } from "react-icons/bi";
import { GiSiren } from "react-icons/gi";
import { ImVolumeMedium, ImVolumeMute2 } from "react-icons/im";
import { io } from "socket.io-client";
import Chat from "../components/Chat";
import FollowBtn from "../components/FollowBtn";
import defaultImg from "../assets/images/img_profile_default.svg";
import { notification } from "antd";
import "antd/dist/antd.css";

const StyledViewer = styled.section`
  width: 100%;
  height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  padding: 20px;

  @media screen and (max-width: 480px) {
    height: calc(100vh - 60px);
    padding: 0;
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  min-width: 330px;
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

const Siren = styled(GiSiren)`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.4rem;
  z-index: 10;
`;

const FullScreen = styled(BiFullscreen)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: grey;
  font-size: 1.4rem;
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
  min-width: 330px;
  width: 100%;
  height: 15%;
  min-height: 150px;
  display: flex;
  justify-content: space-between;
  padding: 20px 10px;
`;

const InfoSection1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  > .stream_title {
    display: -webkit-box;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-black-50);
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

    #studeamer_name {
      margin-top: -3px;
      :hover {
        font-weight: 600;
        cursor: pointer;
      }
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
    min-width: 330px;
  }
`;

const InfoSection2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: space-between;
  color: #838080;
  min-width: 120px;

  span {
    display: inline-block;
    font-size: 0.9rem;
  }

  #study_time {
    text-align: right;
  }

  #study_people {
    display: flex;
    align-items: center;
    gap: 0.4rem;
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

function Viewer() {
  const { id, username, profileImg } = useSelector(
    ({ userReducer }) => userReducer
  );
  const { state } = useLocation();
  const navigate = useNavigate();
  const date = new Date(state.createdAt * 60 * 1000);
  const time =
    date.getHours() === 0
      ? `오전 12시 ${date.getMinutes()}분`
      : date.getHours() >= 1 && date.getHours() < 12
      ? `오전 ${date.getHours()}시 ${date.getMinutes()}분`
      : date.getHours() === 12
      ? `오후 12시 ${date.getMinutes()}분`
      : `오후 ${date.getHours() - 12}시 ${date.getMinutes()}분`;
  const dispatch = useDispatch();
  const peerVideoRef = useRef(HTMLVideoElement);
  const socketRef = useRef(
    io(process.env.REACT_APP_BASE_URL, {
      transports: ["websocket"],
      upgrade: false,
    })
  );
  const viewers = useRef([
    {
      id,
      username,
      profileImg,
    },
  ]);
  const [count, setCount] = useState(viewers.current.length);
  const [liveOn, setLiveOn] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [changeTitle, setChangeTitle] = useState(state.title);
  const audioRef = useRef(HTMLAudioElement);
  const isTest = state.user_id === "2" || state.user_id === "3";

  const openUserProfile = (name) => {
    dispatch(profileModalOpen(true, name));
  };

  const muteHandler = () => {
    setIsMute(!isMute);
  };

  useEffect(() => {
    const peerConnection = new RTCPeerConnection(StunServer); //rtc 커넥션 객체를 만듦
    const socket = socketRef.current;
    setCount(state.headCount + 1);

    socket.on("connect", () => {
      viewers.current[0].socketId = socket.id;
      socket.emit("join_room", {
        id,
        username,
        profileImg,
        socketId: socket.id,
        uuid: state.uuid,
      });
    });

    socket.on("welcome", (viewerInfo) => {
      if (viewerInfo.socketId !== socket.id) {
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
        viewers.current.push(viewerInfo);
        setCount(viewers.current.length);
        if (count > 4) {
          navigate("/home");
          notification.warning({
            message: (
              <div style={{ fontSize: "1rem" }}>
                입장 가능 인원이 초과되었습니다.
              </div>
            ),
          });
        }
      }
    });

    socket.on("offer", async (offer, socketId, hostId, sound) => {
      if (socketId === socket.id) {
        peerConnection.onicecandidate = (data) => {
          if (data.candidate) {
            socket.emit("ice", data.candidate, state.uuid, hostId, socket.id);
          }
        };

        peerConnection.setRemoteDescription(offer);
        const answer = await peerConnection.createAnswer();
        peerConnection.setLocalDescription(answer);

        if (sound) {
          audioRef.current.src = `/assets/sound/${sound}.mp3`;
          audioRef.current.volume = 0.1;
          audioRef.current.play();
        }

        socket.emit("answer", answer, state.uuid, socket.id);
      } else return;
    });

    socket.on("ice", (ice, socketId) => {
      if (socket.id === socketId) {
        peerConnection.addIceCandidate(ice);
      } else return;
    });

    socket.on("leave_room", (socketId) => {
      viewers.current = viewers.current.filter(
        (viewer) => viewer.socketId !== socketId
      );
      setCount(viewers.current.length);
      <Cam ref={peerVideoRef} autoPlay playsInline undefined />;
    });

    socket.on("close_room", () => {
      setLiveOn(false);
      socket.disconnect();
      peerConnection.close();
      audioRef.current.muted = true;
      audioRef.current.pause();
    });

    peerConnection.ontrack = (data) => {
      peerVideoRef.current.srcObject = data.streams[0];
    };

    socket.on("update_viewer", (updatedViewer) => {
      viewers.current.forEach((viewer) => {
        if (viewer.socketId === updatedViewer.socketId) {
          viewer.id = updatedViewer.id;
          viewer.username = updatedViewer.username;
          viewer.profileImg = updatedViewer.profileImg;
        }
      });
    });

    audioRef.current.addEventListener("ended", () => {
      audioRef.current.loop = true;
      audioRef.current.play();
    });

    return () => {
      socket.disconnect();
      if (peerConnection) {
        peerConnection.close();
      }
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const updatedUser = {
      id,
      username,
      profileImg,
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
    // eslint-disable-next-line
  }, [id, username, profileImg]);

  useEffect(() => {
    if (!isMute) audioRef.current.play();
    else audioRef.current.pause();
  }, [isMute]);

  useEffect(() => {
    audioRef.current.volume = 0.1;
  }, []);

  useEffect(() => {
    socketRef.current.on("update_title", (studeamingTitle) => {
      if (state.title !== studeamingTitle) {
        setChangeTitle(studeamingTitle);
      }
    });
    // eslint-disable-next-line
  }, []);

  return (
    <StyledViewer>
      <audio autoPlay ref={audioRef} src="/assets/sound/fire.mp3" />
      <Container>
        <ScreenSection>
          <Screen>
            {liveOn ? (
              isTest ? (
                <span
                  style={{
                    color: "white",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  테스트용 데이터입니다
                </span>
              ) : (
                <Cam ref={peerVideoRef} autoPlay playsInline undefined />
              )
            ) : (
              <span
                style={{ color: "white", fontSize: "2rem", fontWeight: "bold" }}
              >
                방송이 종료되었습니다
              </span>
            )}
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
              <span className="stream_title">{changeTitle}</span>
              <div className="studeamer_info">
                <img src={state.profileImg || defaultImg} alt="" />
                <span
                  id="studeamer_name"
                  onClick={() => {
                    openUserProfile(state.username);
                  }}
                >
                  {state.username}
                </span>
                <FollowBtn username={state.username} />
              </div>
            </InfoSection1>
            <InfoSection2>
              <span id="study_time">
                공부 시작 시간 <br />
                {time}
              </span>
              <div id="study_people">
                <IoPeople />
                <span>{count}명 공부 중</span>
              </div>
            </InfoSection2>
          </StudeamerInfo>
        </ScreenSection>
        <ChatSection>
          <Chat
            socket={socketRef.current}
            viewers={viewers}
            uuid={state.uuid}
          />
        </ChatSection>
      </Container>
    </StyledViewer>
  );
}

export default Viewer;
