import { useState, useEffect } from "react";
import styled from "styled-components";
import "moment/locale/ko";
import logAPI from "../api/studyLog";
import LogChart from "./LogChart";

const Container = styled.div`
  display: flex;
  padding: 0.4rem;
  gap: 1.2rem;

  #date {
    font-size: 1.4rem;
  }

  #day {
  }

  #right {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    margin: 1rem 0 0.4rem 0;
  }

  .comment-box {
    background-color: var(--color-main-25);
    border-radius: 0.8rem;
    padding: 1rem;
  }

  .log-header {
    display: flex;
    flex-direction: column;
    padding: 0 0 0.4rem;
    margin-bottom: 0.4rem;

    .studytime-title {
      font-size: 0.9rem;
      color: var(--color-black-25);
    }

    .studytime {
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-black-25);
    }
  }

  .chartbox {
    width: 180px;
    height: 290px;
  }
`;

function DailyLog({ moment }) {
  const [studyTime, setStudyTime] = useState({ hour: 9, minute: 52 });
  const date = moment.format("YYYYMMDD");
  const offset = new window.Date().getTimezoneOffset();

  const getDailyData = async (date, offset) => {
    try {
      const res = await logAPI.getLogs(date, offset);
      const hour = Math.floor(res.data.studyTime / 60);
      const minute = res.data.studyTime % 60;
      // setStudyTime({hour, minute});
    } catch {}
  };

  useEffect(() => {
    getDailyData(date, offset);
  });

  return (
    <Container>
      <div id="left">
        <span id="date">{moment.locale("ko").format("YYYY년 MMMM Do")}</span>{" "}
        <span id="day">{moment.locale("ko").format("dddd")}</span>
        <section className="comment-area">
          <div className="comment-header">
            <span>오늘의 코멘트</span>
            <button>전체 삭제</button>
          </div>
          <div className="comment-box">
            <textarea rows="13" cols="35"></textarea>
          </div>
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
