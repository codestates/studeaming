import { useState, useEffect } from "react";
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

const ChatInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 5%;
  border-radius: 0.5rem;
  background-color: #f8f8f8;
  padding-left: 10px;

  @media screen and (max-width: 480px) {
    height: 30px;
  }

  > .non_member {
    color: #838080;
  }
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
  const { isLogin, username, profileImg } = useSelector(
    ({ userReducer }) => userReducer
  );
  const [inputClick, setInputClick] = useState(false);
  const [studyTime, setStudyTime] = useState({ hour: 0, minute: 0 });
  const [letter, setLetter] = useState("");
  const [chattingList, setChattingList] = useState([]);
  const dispatch = useDispatch();
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
    if (isLogin) setInputClick(!inputClick);
    else dispatch(signinModalOpen(true));
  };

  const chattingHandler = (idx) => {
    const clicked = chat[idx].comment;
    setInputClick(false);
    setLetter(clicked);
  };

  const sendHandler = () => {
    const newChattingList = [...chattingList];
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
          {letter}
        </span>
      </div>
    );
    newChattingList.push(newLetter);
    setLetter("");
    setChattingList(newChattingList);
  };

  useEffect(() => {
    if (isLogin) {
      logAPI.getLogs(eightDigitDate, offset).then((res) => {
        const hour = Math.floor(res.data.studyTime / 60);
        const minute = res.data.studyTime % 60;
        setStudyTime({ hour, minute });
      });
    }
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
        {isLogin ? (
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
        ) : (
          <Comment className="non_member">로그인 후 이용가능 합니다.</Comment>
        )}

        <SendIcon
          onClick={(e) => {
            e.stopPropagation();
            if (letter.length) sendHandler();
          }}
        />
      </ChatInput>
    </ChatStyle>
  );
}

export default Chat;
