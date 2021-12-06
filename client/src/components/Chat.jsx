import { useState, useEffect } from "react";
import styled from "styled-components";
import { FaTelegramPlane } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import "dayjs/locale/ko";
import logAPI from "../api/studyLog";

const ChatStyle = styled.section`
  display: flex;
  flex-direction: column;
  width: 25%;
  height: 80%;
  position: relative;
`;

const ChatSection = styled.section`
  width: 100%;
  height: 95%;
  border-radius: 0.5rem;
  background-color: #e4e8f7;
  display: flex;
  flex-direction: column;
`;

const ChatInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 5%;
  border-radius: 0.5rem;
  background-color: #f8f8f8;
  padding-left: 10px;
`;

const Comment = styled.span`
  font-size: 12px;
  display: flex;
  align-items: center;
`;

const CloseIcon = styled(IoIosCloseCircle)`
  opacity: 0.15;

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

function Chat() {
  const [inputClick, setInputClick] = useState(false);
  const [studyTime, setStudyTime] = useState({ hour: 0, minute: 0 });
  const [letter, setLetter] = useState("");
  const [chattingList, setChattingList] = useState([]);
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

  const chatInputHandler = () => {
    setInputClick(!inputClick);
  };

  const chattingHandler = (idx) => {
    const clicked = chat[idx].comment;
    setInputClick(false);
    setLetter(clicked);
  };

  const sendHandler = () => {
    const newChattingList = [...chattingList];
    newChattingList.push(letter);
    setLetter("");
    setChattingList(newChattingList);
  };

  useEffect(() => {
    logAPI.getLogs(eightDigitDate, offset).then((res) => {
      const hour = Math.floor(res.data.studyTime / 60);
      const minute = res.data.studyTime % 60;
      setStudyTime({ hour, minute });
    });
  }, []);

  return (
    <ChatStyle>
      <ChatSection>
        {chattingList.map((el, idx) => (
          <span key={idx}>{el}</span>
        ))}
      </ChatSection>
      {inputClick ? (
        <ImoticonBox>
          {chat.map((el, idx) => (
            <Imoticon key={idx} onClick={() => chattingHandler(idx)}>
              {el.imoticon}
            </Imoticon>
          ))}
        </ImoticonBox>
      ) : null}
      <ChatInput onClick={chatInputHandler}>
        <Comment>
          {letter}
          {letter ? (
            <CloseIcon
              onClick={(e) => {
                e.stopPropagation();
                setLetter("");
              }}
            />
          ) : null}
        </Comment>
        <SendIcon
          onClick={(e) => {
            e.stopPropagation();
            sendHandler();
          }}
        />
      </ChatInput>
    </ChatStyle>
  );
}

export default Chat;
