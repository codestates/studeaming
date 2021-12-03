import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Video from "./Video";
import SocketIOClient, { io } from "socket.io-client";
import styled from "styled-components";
import Viewer from "../pages/Viewer";

export const LiveVideo = styled.video`
  transform: rotateY(180deg);
  webkit-transform: rotateY(180deg); *여기는 사파리*
  moz-transform: rotateY(180deg); *이거는 파이어폭스*
`;

// todo: stun 서버 여러개
const StunServer = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

function Screen() {
  const pcsRef = useRef(new RTCPeerConnection({ socketId: "" }));
  const localVideoRef = useRef(HTMLVideoElement);
  let localStreamRef = useRef(MediaStream);
  const socketRef = useRef();
  const [users, setUsers] = useState([
    { id: "", email: "", stream: MediaStream },
  ]);
  const [camHidden, setCamHidden] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [roomname, setRoomname] = useState();

  const newID = function () {
    return Math.random().toString(36).substr(2, 16);
  };

  // todo: input창에 방 제목 입력하면 접속
  // todo: 일단 이 함수는 보류
  // const handleWelcomeSubmit = async (event) => {
  //   event.preventDefault();
  //   setRoomname(textInput);
  //   setTextInput("");
  // };

  // //todo : Media 스트림 설정
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

  // todo: 연결 만들어주는 PeerConnect
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
      if (localStreamRef.current) {
        console.log("localstream add");
        localStreamRef.current.getTracks().forEach((track) => {
          if (!localStreamRef.current) return;
          pc.addTrack(track, localStreamRef.current);
        });
      } else {
        console.log("no local stream");
      }
      return pc;
    } catch (e) {
      console.log(e);
    }
  }, []);
  // TODO: useEffect 렌더링 되는곳
  // todo: main에서 connect가 연결이 실행
  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000", {
      reconnectionDelay: 1000,
      reconnection: true,
      transports: ["polling"],
      //todo: 기존 connection 재사용 여부
      forceNew: true,
      withCredentials: true,
    });
    //todo: 일단은 getLocalStream() 실행중지
    getLocalStream();

    socketRef.current.on("all_users", (allUsers) => {
      console.log("올 유저", allUsers);
      allUsers.forEach(async (user) => {
        const { id, email } = user;
        console.log("로컬스트림 커렌트", localStreamRef.current);
        if (!localStreamRef.current) return;
        const pc = createPeerConnection(user.id, user.email);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createPeerConnection, getLocalStream]);

  // const newSocket = io.connect("http://localhost:4001", {
  //   withCredentials: true,
  //   reconnectionDelay: 1000,
  //   reconnection: true,
  //   reconnectionAttempts: 10,
  //   transports: ["websocket"],
  //   agent: false,
  //   upgrade: false,
  //   rejectUnauthorized: false,
  // });
  // let localStreamRef = useRef(MediaStream);

  // // todo: 커뮤니케이션을 위한 RTC

  // const createPeerConnection = (socketID, email, newSocket, localStreamRef) => {
  //   const pc = new RTCPeerConnection(StunServer);
  //   pcsRef = [...pcsRef, socketID];
  //   pc.onicecandidate = (e) => {
  //     if (e.candidate) {
  //       console.log("onicecandidate");
  //       newSocket.emit("candidate", {
  //         candidate: e.candidate,
  //         candidateSendID: newSocket.id,
  //         cnadidateReceiveID: socketID,
  //       });
  //     }
  //   };
  //   pc.oniceconnectionstatechange = (e) => {
  //     console.log(e);
  //   };
  //   pc.ontrack = (e) => {
  //     console.log("ontrack success");
  //     setUsers((oldUsers) => oldUsers.filter((user) => user.id !== socketID));
  //     setUsers((oldUsers) => [
  //       ...oldUsers,
  //       [{ id: socketID, email: email, stream: e.stream[0] }],
  //     ]);
  //   };
  //   if (localStreamRef) {
  //     console.log("localStreamRef added");
  //     localStreamRef.getTracks().forEach((track) => {
  //       pc.addTrack(track, localStreamRef);
  //     });
  //   } else {
  //     console.log("no local stream");
  //   }
  //   return pc;
  // };

  // newSocket.on("all_users", ([id, email]) => {
  //   let allUsers = [[id, email]];
  //   let len = allUsers.length;
  //   for (let i = 0; i < len; i++) {
  //     createPeerConnection(
  //       allUsers[i],
  //       id,
  //       allUsers[i].email,
  //       newSocket,
  //       localStreamRef
  //     );
  //     const pc = new RTCPeerConnection([allUsers[i].id]);
  //     if (pc) {
  //       pc.createOffer({
  //         offerToReceiveAudio: true,
  //         offerToReceiveVideo: true,
  //       })
  //         .then((sdp) => {
  //           console.log("create offer success");
  //           pc.setLocalDescription(new RTCSessionDescription(sdp));
  //           newSocket.emit("offer", {
  //             sdp: sdp,
  //             offerSendID: newSocket.id,
  //             offerSendEmail: "offerSendSample@sample.com",
  //             offerReceiveID: allUsers[i].id,
  //           });
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }
  //   }
  // });
  // newSocket.on("getOffer", (sdp, offerSendID, offerSendEmail) => {
  //   // let sdp;
  //   // let offerSendID = "string";
  //   // let offerSendEmail = "string";
  //   const data = { sdp, offerSendID, offerSendEmail };
  //   createPeerConnection(
  //     data.offerSendID,
  //     data.offerSendEmail,
  //     newSocket,
  //     localStreamRef
  //   );
  //   const pc = pcsRef(data.offerSendID);
  //   if (pc) {
  //     pc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(() => {
  //       console.log("answer set remote description successfully");
  //       pc.createAnswer({
  //         offerToReceiveAudio: true,
  //         offerToReceiveVideo: true,
  //       })
  //         .then((sdp) => {
  //           console.log("create answer successfully");
  //           pc.setLocalDescription(new RTCSessionDescription(sdp));
  //           newSocket.emit("answer", {
  //             sdp: sdp,
  //             answerSendID: newSocket.id,
  //             answerReceiveID: data.offerSendID,
  //           });
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     });
  //   }
  // });

  // newSocket.on("getAnswer", (sdp, answerSendID) => {
  //   console.log("get answer");
  //   const data = { sdp, answerSendID };

  //   const pc = pcsRef(data.answerSendID);
  //   if (pc) {
  //     pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
  //   }
  //   console.log("getAnswer sdp", sdp);
  // });
  // newSocket.on("getCandidate", (candidate, candidateSendID) => {
  //   console.log("get candidate");
  //   const data = { candidate: candidate, candidateSendID: candidateSendID };
  //   const pc = pcsRef(data.candidateSendID);
  //   if (pc) {
  //     pc.addIceCandidate(new RTCIceCandidate(data.candidate)).then(() => {
  //       console.log("candidate add success");
  //     });
  //   }
  // });
  // newSocket.on("user_exit", (id) => {
  //   const data = { id: id };
  //   pcsRef(data.id).close();
  //   delete pcsRef(data.id);
  //   setUsers((oldUsers) => oldUsers.filter((user) => user.id !== data.id));
  // });

  // todo : 함수 모음
  const Findinput = (data) => {
    setTextInput(data.target.value);
  };

  return (
    <>
      <div>스터디밍 시작하기</div>
      <div className="Cam">
        <LiveVideo
          autoPlay
          playsInline
          width="500"
          height="500"
          ref={localVideoRef}
        />
        <div className="welcome"></div>
      </div>
    </>
  );
}
export default Screen;
