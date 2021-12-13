import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { FaTelegramPlane } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import "dayjs/locale/ko";
import { signinModalOpen } from "../store/actions/index";
import logAPI from "../api/studyLog";

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
  border-radius: 0.5rem;
  background-color: #e4e8f7;
  display: flex;
  flex-direction: column;
  overflow: scroll;
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
  border-radius: 3rem;
  background-color: #f8f8f8;
  font-size: 12px;
  padding-left: 30px;

  > .non_member {
    color: #838080;
  }
`;

const Comment = styled.span`
  font-size: 12px;
  display: flex;
  align-items: center;
  position: absolute;
  top: 25%;
  left: 10px;
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

  @media screen and (max-height: 780px) {
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
  const { isLogin } = useSelector(({ userReducer }) => userReducer);
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
      comment: `${studyTime.hour}시간 ${studyTime.minute}분째 공부중!🕖`,
    },
    { imoticon: "🙂", comment: "안녕하세요!🙂" },
    { imoticon: "💪", comment: "열공하세요!💪" },
    { imoticon: "👋", comment: "안녕히계세요!👋" },
    { imoticon: "🙏", comment: "잘부탁드립니다!🙏" },
    { imoticon: "🤔", comment: "음..🤔" },
    { imoticon: "😴", comment: "졸리네요..😴" },
    { imoticon: "😭", comment: "슬프네요😭" },
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
    }
    const message = chat[idx].comment;
    setInputClick(false);
    setLetter({ message, idx });
    inputRef.current.focus();
  };

  const sendHandler = (idx) => {
    const newChattingList = [...chattingList];
    socket.on("welcome", (user) => {
      const Usernotification = (
        <div>
          <span style={{ fontSize: "12px" }}>
            {user.username || "구경꾼"}님이 입장하셨습니다.
          </span>
        </div>
      );
      newChattingList.push(Usernotification);
      setChattingList(newChattingList);
    });

    socket.on("leave_room", (_, username) => {
      const Usernotification = (
        <div>
          <span style={{ fontSize: "12px" }}>
            {username || "구경꾼"}님이 나가셨습니다.
          </span>
        </div>
      );
      newChattingList.push(Usernotification);
      setChattingList(newChattingList);
    });

    if (idx || idx === 0) {
      socket.emit("chat", uuid, socket.id, idx);
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

  useEffect(() => {
    const newChattingList = [...chattingList];
    socket.on("newChat", (uuid, userId, chatIdx) => {
      const writeUser = viewers.current.filter(
        (viewer) => viewer.socketId && viewer.socketId === userId
      );

      setLetter({ message: chat[chatIdx], idx: chatIdx });

      const newLetter = (
        <div>
          <img
            src={writeUser[0].profileImg}
            alt=""
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              margin: "5px",
            }}
          />
          <span
            style={{
              fontSize: "12px",
              color: "var(--color-black-50)",
              marginRight: "0.8rem",
            }}
          >
            {writeUser[0].username}
          </span>
          <span style={{ fontSize: "12px" }}>{chat[chatIdx].comment}</span>
        </div>
      );
      newChattingList.push(newLetter);
      setLetter({ message: "", idx: null });
      setChattingList(newChattingList);
      inputRef.current.blur();
    });
  }, []);

  useEffect(() => {
    sendHandler();
    scrollToBottom();
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
