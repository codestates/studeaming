import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import styled from "styled-components";
import dayjs from "dayjs";
import { VscChevronLeft, VscChevronRight } from "react-icons/vsc";
import statisticsAPI from "../api/statistics";
import {
  loginStateChange,
  signinModalOpen,
  dailyLogOpen,
} from "../store/actions";

const weekOfYear = require("dayjs/plugin/weekOfYear");
dayjs.extend(weekOfYear);

const Container = styled.section`
  width: 100%;
  height: 84%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
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
      margin-bottom: 5px;
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
  background-color: ${(props) => {
    if (props.isThisMonth) return "var(--color-gray-bg)";
    else {
      return `var(--color-main-${props.grape})`;
    }
  }};
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
  const [standard, setStandard] = useState(() => dayjs()); /* 월 변경 기준*/
  const [grape, setGrape] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const today = dayjs();

  const getReport = (moment) => {
    const year = parseInt(moment.format("YYYY"));
    const month = parseInt(moment.format("MM"));
    const offset = new window.Date().getTimezoneOffset();
    statisticsAPI
      .getMonthlyReport(year, month, offset)
      .then((res) => {
        const report = res.data.report.map((time) => {
          if (time <= 0) return 0;
          else if (0 < time && time <= 120) return 25;
          else if (120 < time && time <= 240) return 50;
          else if (240 < time && time <= 360) return 60;
          else if (360 < time) return 75;
          else return 0;
        });
        setGrape(report);
      })
      .catch(() => {
        dispatch(loginStateChange(false));
        navigate("/home");
        dispatch(signinModalOpen(true));
      });
  };

  const handleDayClick = (moment, isFuture) => {
    if (!isFuture) dispatch(dailyLogOpen(true, moment));
  };

  const returnToday = () => {
    return setStandard(dayjs());
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

              const isThisMonth = current.format("MM") === date.format("MM");
              const isToday =
                today.format("YYYYMMDD") === current.format("YYYYMMDD")
                  ? "today"
                  : "";
              const isFuture =
                current.format("YYYYMMDD") > today.format("YYYYMMDD")
                  ? "future"
                  : "";
              const targetDate = parseInt(current.format("D"));

              return (
                <Date
                  isThisMonth={!isThisMonth}
                  isFuture={isFuture}
                  grape={grape[targetDate - 1]}
                  key={idx}
                  onClick={() => handleDayClick(current, isFuture)}
                >
                  <div className={isToday}>
                    <span className={`date-text ${isFuture}`}>
                      {targetDate}
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
    getReport(standard);
    // eslint-disable-next-line
  }, [standard]);

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
          {["일", "월", "화", "수", "목", "금", "토"].map((day, idx) => (
            <span className="day-text" key={idx}>
              {day}
            </span>
          ))}
        </div>
        {generate()}
      </Body>
    </Container>
  );
}

export default Calendar;
