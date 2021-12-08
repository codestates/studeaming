import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Viewer from "../pages/Viewer";
import styled from "styled-components";
import studyroomAPI from "../api/";
import defaultImg from "../assets/images/img_profile_default.svg";
import empty from "../assets/images/empty.png";

const StyledMainContents = styled.section`
  display: grid;
  place-items: center;
  max-width: 2000px;
  grid-template-rows: repeat(auto-fill, 1fr);
  grid-template-columns: repeat(5, 1fr);
  gap: 10px 10px;
  padding: 5px;

  @media screen and (max-width: 1480px) {
    grid-template-rows: repeat(auto-fill, 1fr);
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (max-width: 1130px) {
    grid-template-rows: repeat(auto-fill, 1fr);
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (max-width: 780px) {
    grid-template-rows: repeat(auto-fill, 1fr);
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 530px) {
    grid-template-rows: repeat(auto-fill, 1fr);
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Contents = styled.div`
  width: 100%;
  max-width: 360px;
  height: 100%;
  min-height: 320px;

  @media screen and (max-width: 530px) {
    max-width: 100%;
    height: 360px;
  }
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 70%;
  background-image: url(${(props) => props.img});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: 1px solid;

  @media screen and (max-width: 530px) {
    height: 75%;
  }
`;

const Desc = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 30%;
  padding: 6px;
  background-color: #f8f8f8;

  @media screen and (max-width: 530px) {
    height: 25%;
  }

  > .thumbnail_title {
    display: -webkit-box;
    height: 50px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
  }

  > .thumbnail_info {
    display: flex;
    align-items: center;
    height: 100%;

    > img {
      height: 45px;
      width: 45px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 4px;
    }

    > .thumbnail_info_name {
      padding: 2px;
      > div {
        padding: 3px;
        font-size: 14px;
      }
    }
  }
`;

const NoContents = styled.div`
  display: flex;
  flex-direction: column;
`;
const StunServer = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

function MainContents({ contents }) {
  //todo: 준비물
  const pcsRef = useRef(new RTCPeerConnection({ socketId: "" }));
  const localVideoRef = useRef(HTMLVideoElement);
  let localStreamRef = useRef(MediaStream);
  const socketRef = useRef();
  const [users, setUsers] = useState([
    { id: "", email: "", stream: MediaStream },
  ]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useSelector(({ userReducer }) => userReducer);
  //todo: --------------------------------

  // todo: home페이지에서 떠있는 방송목록을 클릭하면 연결이 일어난다 - Aciton
  const createPeerConnection = useCallback((socketID, email) => {
    try {
      const pc = new RTCPeerConnection(StunServer);
      console.log("피씨", pc);
      console.log("소켓아이디", socketID);

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
        setUsers((oldUsers) => {
          console.log("올드유저", oldUsers);
          oldUsers
            .filter((user) => user.id !== socketID)
            .concat({
              id: socketID,
              email: email,
              stream: e.streams[0],
            });
        });
      };
      // if (localStreamRef.current) {
      //   console.log("localstream add", localStreamRef.current.getTracks());
      //   localStreamRef.current.getTracks().forEach((track) => {
      //     if (!localStreamRef.current) return;
      //     pc.addTrack(track, localStreamRef.current);
      //   });
      // } else {
      //   console.log("no local stream");
      // }
      return pc;
    } catch (e) {
      console.log(e);
    }
  }, []);
  // todo: -------------------------------------------------------

  // todo: 함수
  const navigateLanding = (el) => {
    socketRef.current.emit("join_room", {
      // TODO: USER ID
      user_ID: "",
    });
    createPeerConnection();
    navigate("/viewer", { state: el });
  };
  //todo: ----------------------

  // todo: 테스트용
  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000", {
      transports: ["polling"],
      //todo: 기존 connection 재사용 여부
      forceNew: true,
      withCredentials: true,
    });

    socketRef.current.on("all_users", (allUsers) => {
      console.log("올 유저", allUsers);
      allUsers.forEach(async (user) => {
        console.log("유저스", user);
        const { id, email } = user;
        if (!localStreamRef.current) return;
        const pc = createPeerConnection(id, email);
        console.log("피씨", pc);
        console.log("피씨 Ref", pcsRef.current);
        if (!(pc && socketRef.current)) return;
        pcsRef.current = { ...pcsRef.current, id };
        try {
          const localSdp = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          console.log("create offer success");
          // todo: sdp만들어서 먼저 세션에 저장하고 날리기
          await pc.setLocalDescription(new RTCSessionDescription(localSdp));
          socketRef.current.emit("offer", {
            sdp: localSdp,
            offerSendID: socketRef.current.id,
            offerSendEmail: "offersendSample@sample.com",
            offerReceiveID: user.id,
          });
        } catch (e) {
          console.log(e);
        }
      });
    });

    socketRef.current.on("getOffer", async (data) => {
      const { sdp, offerSendID, offerSendEmail } = data;
      if (!localStreamRef.currrent) return;
      const pc = createPeerConnection(offerSendID, offerSendEmail);
      if (!(pc && socketRef.current)) return;
      pcsRef.current = [...pcsRef.current, offerSendID];
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log("snswer set remote description successfully");
        const localSdp = await pc.createAnswer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(new RTCSessionDescription(localSdp));
        socketRef.current.emit("answer", {
          sdp: localSdp,
          answerSendID: socketRef.current.id,
          answerReceiveID: offerSendID,
        });
      } catch (e) {
        console.log(e);
      }
    });

    socketRef.current.on("getAnswer", (data) => {
      const { sdp, answerSendID } = data;
      console.log("getAnwer 에스디피", sdp, answerSendID);
      const pc = pcsRef.current[answerSendID];
      if (!pc) return;
      pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });
    socketRef.current.on("getCandidate", async (data) => {
      const { candidate, candidateSendID } = data;
      console.log("getCandidat 캔디데이트", candidate);
      const pc = pcsRef.current[candidateSendID];
      if (!pc) return;
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("candidate add success");
    });
    socketRef.current.on("user_exit", (data) => {
      const { id } = data;
      if (pcsRef.current[id]) return;
      console.log("유저가 나갈때", pcsRef.current);
      pcsRef.current[id].close();
      delete pcsRef.current[id];
      setUsers((oldUsers) => oldUsers.filter((user) => user.id !== id));
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      users.forEach((user) => {
        if (!pcsRef.current[user.id]) return;
        pcsRef.current[user.id].close();
        delete pcsRef.current[user.id];
      });
    };
  }, [createPeerConnection]);
  //todo: -------------------------------------------

  return (
    <StyledMainContents>
      {contents.length ? (
        contents.map((el, idx) => (
          <Contents
            key={idx}
            onClick={() => {
              navigateLanding(el);
            }}
          >
            <Thumbnail img={el.thumbnail} />
            <Desc>
              <div className="thumbnail_title">{el.title}</div>
              <div className="thumbnail_info">
                <img src={el.profileImg || defaultImg} alt="" />
                <div className="thumbnail_info_name">
                  <div style={{ fontWeight: "bold" }}>{el.username}</div>
                  <div style={{ color: "#838080" }}>{el.headCount}명</div>
                </div>
              </div>
            </Desc>
          </Contents>
        ))
      ) : (
        <NoContents>
          <h2>현재 스터디밍이 없습니다...</h2>
          <img src={empty} alt="" style={{ width: "100px" }} />
        </NoContents>
      )}
    </StyledMainContents>
  );
}

export default MainContents;
