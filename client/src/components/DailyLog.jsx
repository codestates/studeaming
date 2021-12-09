import { useState, useEffect } from "react";
import styled from "styled-components";
import "dayjs/locale/ko";
import logAPI from "../api/studyLog";
import LogChart from "./LogChart";

const Container = styled.div`
  display: flex;
  padding: 0.4rem;
  gap: 1.4rem;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }

  #date {
    font-size: 1.4rem;
  }

  #right {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1.4rem 0 0.8rem 0;
    padding: 0 0.2rem;

    .comment-header-title {
      color: var(--color-black-50);
    }

    .comment-header-delete {
      font-size: 0.8rem;
      color: var(--color-black-50);

      :hover {
        font-weight: 700;
      }
    }

    .comment-header-delete-check {
      font-size: 0.8rem;
      color: var(--color-black-50);
      margin-right: 0.4rem;
    }

    .removal-button {
      padding: 0.2rem 0.4rem;
      :hover {
        background-color: var(--color-main-25);
        color: var(--color-main-100);
        border-radius: 0.6rem;
      }
    }
  }

  .log-header {
    display: flex;
    flex-direction: column;
    padding: 0 0 0.4rem;
    margin-bottom: 0.6rem;

    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  .studytime-title {
    font-size: 0.9rem;
    color: var(--color-black-25);
  }

  .studytime {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-black-25);
  }

  .chartbox {
    width: 180px;
    height: 330px;

    @media screen and (max-width: 768px) {
      width: 100%;
      padding-right: 1rem;
    }
  }
`;

const CommentBox = styled.div`
  background-color: ${(props) =>
    props.isEditing ? "transparent" : "var(--color-main-25)"};
  border: 2px solid
    ${(props) => (props.isEditing ? "var(--color-main-50)" : "transparent")};
  border-radius: 0.8rem;
  padding: 1rem;

  @media screen and (max-width: 768px) {
    height: 100px;
  }

  textarea {
    font-family: "NotoSans" !important;
    font-size: 0.8rem;
  }
`;

function DailyLog({ moment }) {
  const [studyTime, setStudyTime] = useState({ hour: 9, minute: 52 });
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState("");
  const [isForSure, setIsForSure] = useState(false);
  const date = moment.format("YYYYMMDD");
  const offset = new window.Date().getTimezoneOffset();

  const getDailyData = async (date, offset) => {
    try {
      const logRes = await logAPI.getLogs(date, offset);
      const commentRes = await logAPI.getComment(date);
      const hour = Math.floor(logRes.data.studyTime / 60);
      const minute = logRes.data.studyTime % 60;
      setStudyTime({ hour, minute });
      setComment(commentRes.data.comment);
    } catch {}
  };

  const getComment = (e) => {
    setComment(e.target.value);
  };

  const finishEditingHandler = () => {
    setIsEditing(false);
    logAPI.modifyComment(date, comment);
  };

  const checkRemoval = () => {
    setIsForSure(true);
  };

  const removeHandler = () => {
    setIsEditing(false);
    setComment("");
    logAPI
      .modifyComment(date, comment)
      .then(() => {
        setIsForSure(false);
      })
      .catch(() => {});
    setIsForSure(false); /* 서버 요청 후 삭제 */
  };

  useEffect(() => {
    getDailyData(date, offset);
  }, []);

  return (
    <Container>
      <div id="left">
        <span id="date">{moment.locale("ko").format("YYYY년 MM월 DD일")}</span>{" "}
        <span id="day">{moment.locale("ko").format("dddd")}</span>
        <section className="comment-area">
          <div className="comment-header">
            <span className="comment-header-title">오늘의 코멘트</span>
            {isForSure ? (
              <div>
                <span className="comment-header-delete-check">
                  정말 모두 지우시겠어요?
                </span>
                <button className="removal-button" onClick={removeHandler}>
                  YES
                </button>
                <button
                  className="removal-button"
                  onClick={() => setIsForSure()}
                >
                  NO
                </button>
              </div>
            ) : (
              <button className="comment-header-delete" onClick={checkRemoval}>
                전체 삭제
              </button>
            )}
          </div>
          <CommentBox isEditing={isEditing}>
            <textarea
              onFocus={() => setIsEditing(true)}
              onBlur={finishEditingHandler}
              onChange={getComment}
              value={comment}
              rows="18"
              cols="50"
              spellCheck="false"
            ></textarea>
          </CommentBox>
        </section>
      </div>
      <div id="right">
        <div className="log-header">
          <span className="studytime-title">총 공부시간</span>
          <span className="studytime">
            {studyTime.hour}시간 {studyTime.minute}분
          </span>
        </div>
        <div className="chartbox">
          <LogChart date={date} offset={offset} />
        </div>
      </div>
    </Container>
  );
}

export default DailyLog;
