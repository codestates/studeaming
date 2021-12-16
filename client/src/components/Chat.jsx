import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { FaTelegramPlane } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { signinModalOpen, profileModalOpen } from "../store/actions/index";
import logAPI from "../api/studyLog";
import userAPI from "../api/user";
import defaultImg from "../assets/images/img_profile_default.svg";

const ChatStyle = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 250px;
  height: 100%;
  position: relative;
`;

const ChatSection = styled.ul`
  width: 100%;
  height: 95%;
  border-radius: 5px;
  background-color: #e4e8f7;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  margin-bottom: 4px;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const ChatInputBox = styled.div`
  height: 5%;
  min-height: 35px;
  position: relative;
  display: flex;
  align-items: center;
`;

const ChatInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  border-radius: 5px;
  background-color: #f8f8f8;
  font-size: 12px;
  padding-left: 35px;
  padding-bottom: 0.1rem;

  > .non_member {
    color: #838080;
  }
`;

const CloseIcon = styled(IoIosCloseCircle)`
  opacity: 0.15;
  position: absolute;
  left: 10px;

  :hover {
    opacity: 1;
  }
`;

const SendIcon = styled(FaTelegramPlane)`
  position: absolute;
  right: 10px;
  opacity: 0.4;
  cursor: pointer;
`;

const ImoticonBox = styled.div`
  position: absolute;
  bottom: 5%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  height: 120px;
  background-color: #f8f8f9;
  opacity: 0.6;

  :hover {
    opacity: 1;
  }

  @media screen and (max-height: 1000px) {
    bottom: 35px;
  }
`;

const Imoticon = styled.div`
  border-radius: 0.5rem;
  background-color: #e4e8f7;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;

  :hover {
    cursor: pointer;
    box-shadow: 0px 0px 1px;
  }
`;

function Chat({ socket, viewers, uuid }) {
  const { isLogin, username } = useSelector(({ userReducer }) => userReducer);
  const [inputClick, setInputClick] = useState(false);
  const [studyTime, setStudyTime] = useState({ hour: 0, minute: 0 });
  const [letter, setLetter] = useState({ message: "", idx: null });
  const [chattingList, setChattingList] = useState([]);
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const ChatingRef = useRef(HTMLUListElement);
  const date = new Date();
  const eightDigitDate = `${date.getFullYear()}${date.getMonth() + 1}${
    date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
  }`;
  const offset = date.getTimezoneOffset();
  const chat = [
    {
      imoticon: "🕖",
      comment: `${studyTime.hour}시간 ${studyTime.minute}분째 공부 중! 🕖`,
    },
    { imoticon: "🙂", comment: "오늘도 화이팅이에요 🙂" },
    { imoticon: "💪", comment: "열공합시다! 💪" },
    { imoticon: "👋", comment: "다음에 또 만나요, 안녕히계세요! 👋" },
    { imoticon: "🙏", comment: "반가워요, 잘 부탁드립니다! 🙏" },
    { imoticon: "😭", comment: "오늘은 잘 안풀리는 날이에요 😭" },
    { imoticon: "😴", comment: "졸리네요.. 모두 잠을 이겨냅시다 😴" },
    { imoticon: "🥰", comment: "모두 잘 될 거에요 🥰" },
  ];

  const imoticonOpenHandler = () => {
    if (isLogin) setInputClick(!inputClick);
    else dispatch(signinModalOpen(true));
  };

  const imoticonClickHandler = async (idx) => {
    if (idx === 0) {
      const res = await logAPI.getLogs(eightDigitDate, offset);
      const hour = Math.floor(res.data.studyTime / 60);
      const minute = res.data.studyTime % 60;
      setStudyTime({ hour, minute });
      setInputClick(false);
      setLetter({ message: `${hour}시간 ${minute}분째 공부 중! 🕖`, idx });
      inputRef.current.focus();
    } else {
      const message = chat[idx].comment;
      setInputClick(false);
      setLetter({ message, idx });
      inputRef.current.focus();
    }
  };

  const sendHandler = (idx) => {
    if (idx) {
      socket.emit("chat", uuid, socket.id, idx);
    } else if (idx === 0) {
      socket.emit("chat", uuid, socket.id, idx, chat[idx].comment);
    }
  };

  const onKeyUpHandler = (e, idx) => {
    if (e.key === "Enter" && letter.message) sendHandler(idx);
    else if (e.key === "Escape" && letter.message) {
      setLetter({ message: "", idx: null });
      setInputClick(false);
      inputRef.current.blur();
    }
  };

  const scrollToBottom = () => {
    if (ChatingRef.current) {
      ChatingRef.current.scrollTop = ChatingRef.current.scrollHeight;
    }
  };

  const openUserInfoHandler = (e) => {
    const name = e.target.textContent;
    if (name !== username) {
      userAPI
        .getOthersInfo(name)
        .then((res) => {
          dispatch(profileModalOpen(true, res.data.profile.username));
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    const newChattingList = [...chattingList];
    socket.on("newChat", (uuid, userId, chatIdx, recievedChat) => {
      const writeUser = viewers.current.filter(
        (viewer) => viewer.socketId && viewer.socketId === userId
      );

      setLetter({
        message: chatIdx ? chat[chatIdx] : recievedChat,
        idx: chatIdx,
      });

      const newLetter = (
        <div>
          <img
            src={writeUser[0].profileImg ? writeUser[0].profileImg : defaultImg}
            alt=""
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              margin: "5px",
              objectFit: "cover",
            }}
          />
          <span
            style={{
              fontSize: "12px",
              color: "var(--color-black-50)",
              marginRight: "0.8rem",
              cursor: "pointer",
            }}
            onClick={(e) => {
              openUserInfoHandler(e);
            }}
          >
            {writeUser[0].username}
          </span>
          <span style={{ fontSize: "12px" }}>
            {chatIdx ? chat[chatIdx].comment : recievedChat}
          </span>
        </div>
      );
      newChattingList.push(newLetter);
      setLetter({ message: "", idx: null });
      setChattingList(newChattingList);
      inputRef.current.blur();
    });

    socket.on("welcome", (user) => {
      const Usernotification = (
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "12px", color: "var(--color-black-50)" }}>
            {user.username || "구경꾼"}님이 입장하셨습니다.
          </span>
        </div>
      );
      newChattingList.push(Usernotification);
      setChattingList(newChattingList);
    });

    socket.on("leave_room", (_, username) => {
      const Usernotification = (
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "12px", color: "var(--color-black-50)" }}>
            {username || "구경꾼"}님이 나가셨습니다.
          </span>
        </div>
      );
      newChattingList.push(Usernotification);
      setChattingList(newChattingList);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    sendHandler();
    scrollToBottom();
    // eslint-disable-next-line
  }, [letter.message, chattingList]);

  return (
    <ChatStyle>
      <ChatSection ref={ChatingRef}>
        {chattingList.map((el, idx) => (
          <span key={idx}>{el}</span>
        ))}
      </ChatSection>
      {inputClick ? (
        <ImoticonBox>
          {chat.map((el, idx) => (
            <Imoticon key={idx} onClick={() => imoticonClickHandler(idx)}>
              {el.imoticon}
            </Imoticon>
          ))}
        </ImoticonBox>
      ) : null}
      <ChatInputBox>
        <ChatInput
          value={letter.message}
          onClick={imoticonOpenHandler}
          onKeyUp={(e) => onKeyUpHandler(e, letter.idx)}
          ref={inputRef}
          readOnly
          placeholder={isLogin ? "" : "로그인 후 이용가능 합니다."}
        />
        {letter.message ? (
          <CloseIcon
            onClick={(e) => {
              e.stopPropagation();
              setLetter({ message: "", idx: null });
            }}
          />
        ) : null}
        <SendIcon
          onClick={(e) => {
            e.stopPropagation();
            if (letter.message) sendHandler(letter.idx);
          }}
        />
      </ChatInputBox>
    </ChatStyle>
  );
}

export default Chat;
