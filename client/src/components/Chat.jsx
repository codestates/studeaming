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

const ChatSection = styled.section`
  width: 100%;
  height: 95%;
  border-radius: 0.5rem;
  background-color: #e4e8f7;
  display: flex;
  flex-direction: column;
  overflow: scroll;

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
  console.log("뷰저스", viewers);
  const { isLogin, username, profileImg } = useSelector(
    ({ userReducer }) => userReducer
  );
  const [inputClick, setInputClick] = useState(false);
  const [studyTime, setStudyTime] = useState({ hour: 0, minute: 0 });
  const [letter, setLetter] = useState({ message: "", idx: null });
  console.log("레터", letter);
  const [chattingList, setChattingList] = useState([]);
  console.log("채팅리스트", chattingList);
  //todo: 추가
  const [chating, setChating] = useState({ userId: "", usechatIdx: null });
  console.log("채팅", chating);
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
    // todo: 서버에 전달해줄 채팅 내용
    if (idx) {
      socket.emit("chat", uuid, socket.id, idx);

      socket.on("newChat", (uuid, userId, chatIdx) => {
        console.log("뉴챗 아이디", userId);
        console.log("뉴챗 인덱스", chatIdx);
        setChating({ userId: userId, usechatIdx: chatIdx });
      });
      console.log("뷰어스", viewers);
      const WriteUser = viewers.current.forEach((data) => {
        if (data.socketId && data.socketId === chating.userId) {
          return data;
        }
      });
      console.log("작성자", WriteUser);
      const newLetter = (
        <div>
          <img
            src={profileImg}
            alt=""
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              margin: "5px",
            }}
          />
          <span style={{ fontSize: "12px" }}>
            {username}
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            {letter.message}
          </span>
        </div>
      );
      if (chat[chating.usechatIdx]) {
        newChattingList.push(chat[chating.usechatIdx].comment);
        setChattingList(newChattingList);
      }
      newChattingList.push(newLetter);
      setLetter({ message: "", idx: null });
      setChattingList(newChattingList);
      inputRef.current.blur();
    }

    // const newLetter = (
    //   <div>
    //     <img
    //       src={profileImg}
    //       alt=""
    //       style={{
    //         width: "30px",
    //         height: "30px",
    //         borderRadius: "50%",
    //         margin: "5px",
    //       }}
    //     />
    //     <span style={{ fontSize: "12px" }}>
    //       {username}
    //       &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    //       {letter.message}
    //     </span>
    //   </div>
    // );

    // if (chat[chating.usechatIdx]) {
    //   newChattingList.push(chat[chating.usechatIdx].comment);
    //   setChattingList(newChattingList);
    // }
    // newChattingList.push(newLetter);
    // setLetter({ message: "", idx: null });
    // setChattingList(newChattingList);
    // inputRef.current.blur();
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
      ChatingRef.current.scrollTop = ChatingRef.current.height;
    }
  };

  // useEffect(() => {
  //   // todo: 여기는 상대방이 보내온 채팅을 보여주는곳
  //   socket.on("newChat", (userId, chatIdx) => {
  //     console.log("뉴챗 아이디", userId);
  //     console.log("뉴챗 인덱스", chatIdx);
  //     setChating({ userId: userId, usechatIdx: chatIdx });
  //   });
  // }, []);

  useEffect(() => {
    scrollToBottom();
  }, [letter.message]);

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
        />
        {isLogin ? (
          letter.message ? (
            <CloseIcon
              onClick={(e) => {
                e.stopPropagation();
                setLetter({ message: "", idx: null });
              }}
            />
          ) : null
        ) : (
          <Comment className="non_member">로그인 후 이용가능 합니다.</Comment>
        )}
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
