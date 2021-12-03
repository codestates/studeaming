import { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { VscChevronLeft, VscChevronRight } from "react-icons/vsc";
import statisticsAPI from "../api/statistics";

const Container = styled.section`
  width: 100%;
  height: 84%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  /* border: 1px solid gray; */
`;

const Head = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  #year-month {
    color: var(--color-black-50);
    font-weight: 700;
    padding: 0.4rem 0;
  }

  .util-button {
    display: flex;
    align-items: center;

    #return-today {
      display: inline-block;
      padding: 0.4rem 0.6rem;
      font-size: 0.8rem;
    }

    .jump-to-button {
      padding: 0.4rem 0.4rem;
    }
  }
`;

const Body = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;

  .day-box {
    padding: 1rem 0;
    display: flex;
    justify-content: space-around;

    .day-text {
      font-size: 0.9rem;
      font-weight: 400;
      color: var(--color-black-50);
    }
  }
`;

const Week = styled.div`
  display: flex;
  height: calc(100% / 5);
`;

const Date = styled.div`
  /* border: 0.2px solid var(--color-black-25); */
  background-color: ${(props) =>
    props.isThisMonth ? "var(--color-gray-bg-50)" : "var(--color-gray-bg)"};
  display: inline-flexbox;
  width: calc(100% / 7);
  color: ${(props) => props.isThisMonth && "var(--color-black-25)"};
  justify-content: center;
  align-items: center;
  margin: 0.1rem;
  cursor: ${(props) => !props.isFuture && "pointer"};

  .today {
    width: 2rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: var(--color-destructive);
    color: white;
  }

  .date-text {
    font-size: 1.2rem;
    margin-top: 3px;
  }

  .future {
    color: var(--color-black-25);
  }
`;

function Calendar() {
  const [standard, setStandard] = useState(() => moment()); /* 월 변경 기준*/
  const [report, setReport] = useState(
    Array(20).concat([120, 150, 180, 300, 340, 75, 120, 350, 240, 260, 300])
  ); /* 임시 더미 */
  const today = moment();
  const offset = new window.Date().getTimezoneOffset();

  const handleDayClick = (current) => {}; // modal open
  const returnToday = () => {
    return setStandard(moment());
  };
  const getReport = (year, month, offset) => {
    statisticsAPI.getMonthlyReport(year, month, offset).then((res) => {
      setReport(res.data.report);
    });
  };
  const jumpToMonth = (num) => {
    if (num > 0) {
      setStandard(standard.clone().add(1, "month"));
    } else {
      setStandard(standard.clone().subtract(1, "month"));
    }
  };

  const generate = () => {
    const date = standard;
    const startWeek = date.clone().startOf("month").week();
    const endWeek =
      date.clone().endOf("month").week() === 1
        ? 53
        : date.clone().endOf("month").week();
    const calendar = [];

    for (let week = startWeek; week <= endWeek; week += 1) {
      calendar.push(
        <Week key={week}>
          {Array(7)
            .fill(null)
            .map((n, idx) => {
              const current = date
                .clone()
                .week(week)
                .startOf("week")
                .add(n + idx, "day");

              const isToday =
                today.format("YYYYMMDD") === current.format("YYYYMMDD")
                  ? "today"
                  : "";
              const isThisMonth = current.format("MM") == date.format("MM");
              const isFuture =
                current.format("YYYYMMDD") > today.format("YYYYMMDD")
                  ? "future"
                  : "";

              // 오늘 이전 날짜만 로그 기록 및 열람 가능 (클릭)
              //
              return (
                <Date
                  isThisMonth={!isThisMonth}
                  isFuture={isFuture}
                  key={idx}
                  onClick={() => handleDayClick(current, isFuture)}
                >
                  <div className={isToday}>
                    <span className={`date-text ${isFuture}`}>
                      {current.format("D")}
                    </span>
                  </div>
                </Date>
              );
            })}
        </Week>
      );
    }
    return calendar;
  };

  useEffect(() => {
    getReport();
  });

  return (
    <Container>
      <Head>
        <span id="year-month">
          {standard.format("YYYY")}년 {standard.format("MM")}월
        </span>
        <div className="util-button">
          <button className="jump-to-button" onClick={() => jumpToMonth(-1)}>
            <VscChevronLeft />
          </button>
          <button id="return-today" onClick={returnToday}>
            오늘
          </button>
          <button className="jump-to-button" onClick={() => jumpToMonth(1)}>
            <VscChevronRight />
          </button>
        </div>
      </Head>
      <Body>
        <div className="day-box">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <span className="day-text">{day}</span>
          ))}
        </div>
        {generate()}
      </Body>
    </Container>
  );
}

export default Calendar;
