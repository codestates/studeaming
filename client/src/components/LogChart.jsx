import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sideLogOpen, logout, signinModalOpen } from "../store/actions/index";
import styled from "styled-components";
import logAPI from "../api/studyLog";

const LogChartSection = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;

  > .ten_minute {
    display: flex;
    width: 100%;
    height: calc(100% / 25);

    > .ten_minute_block {
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(100% / 7);
    }
  }
`;

const HourListAndChartContainer = styled.div`
  display: flex;
  height: 100%;
  > .hour_block_wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: calc(100% / 7);

    > .hour_block {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-right: 1px solid;
    }
  }
`;

const LogChartTimeSpan = styled.span`
  font-size: 10px;
`;

const Chart = styled.section`
  width: ${100 - 100 / 7}%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const Log = styled.div`
  margin-top: 2%;
  position: absolute;
  height: 2%;
  top: ${(props) => props.top}%;
  width: ${(props) => props.width}%;
  left: ${(props) => props.left}%;
  background-color: ${(props) => props.color};

  :hover {
    transform: scaleY(1.1);
  }
`;

function LogChart({ date, offset }) {
  const { isLogin } = useSelector(({ userReducer }) => userReducer);
  const [log, setLog] = useState([]);
  const dispatch = useDispatch();
  const minute = ["", 10, 20, 30, 40, 50, 60];
  const hour = new Array(24).fill(0).map((_, idx) => idx);

  const fillLog = (loglist) => {
    const newLog = [];
    for (let i = 0; i < loglist.length; i++) {
      const studylog = [...loglist][i];
      const start = studylog.startedAt;
      const finish = studylog.finishedAt;
      const startTime = Math.floor(start / 60);
      const finishTime = Math.floor(finish / 60);

      for (let i = startTime; i <= finishTime; i++) {
        if (i === startTime) {
          newLog.push({
            name: studylog.name,
            color: studylog.color,
            top: i * (100 / 24),
            left: (start % 60) * (5 / 3),
            width: (finish - start) * (5 / 3),
            hour: Math.floor((finish - start) / 60),
            minute: (finish - start) % 60,
          });
        } else if (i > startTime && i !== finishTime) {
          newLog.push({
            name: studylog.name,
            color: studylog.color,
            top: i * (100 / 24),
            left: 0,
            width: 100,
            hour: Math.floor((finish - start) / 60),
            minute: (finish - start) % 60,
          });
        } else if (i === finishTime) {
          newLog.push({
            name: studylog.name,
            color: studylog.color,
            top: i * (100 / 24),
            left: 0,
            width: (finish - 60 * i) * (5 / 3),
            hour: Math.floor((finish - start) / 60),
            minute: (finish - start) % 60,
          });
        }
      }
      setLog([...newLog]);
    }
  };

  const getLogsHandler = () => {
    logAPI
      .getLogs(date, offset)
      .then((res) => {
        const studylogList = res.data.studylogList.map((list) => {
          const utcStart = list.startedAt * 60000;
          const utcFinish = list.finishedAt * 60000;
          const startedAt =
            new Date(utcStart).getHours() * 60 +
            new Date(utcStart).getMinutes();
          const finishedAt =
            new Date(utcFinish).getHours() * 60 +
            new Date(utcFinish).getMinutes();
          const newList = { ...list, startedAt, finishedAt };
          return newList;
        });
        fillLog(studylogList);
      })
      .catch(() => {
        dispatch(logout());
        dispatch(sideLogOpen(false));
        dispatch(signinModalOpen(true));
      });
  };

  useEffect(() => {
    if (isLogin) getLogsHandler();
  }, []);

  return (
    <LogChartSection>
      <div className="ten_minute">
        {minute.map((el, idx) => (
          <div key={idx} className="ten_minute_block">
            <LogChartTimeSpan>{el}</LogChartTimeSpan>
          </div>
        ))}
      </div>
      <HourListAndChartContainer>
        <div className="hour_block_wrapper">
          {hour.map((el, idx) => (
            <div className="hour_block" key={idx}>
              <LogChartTimeSpan>{el}</LogChartTimeSpan>
            </div>
          ))}
        </div>
        <Chart>
          {log.map((el, idx) => (
            <Log
              key={idx}
              color={el.color}
              left={el.left}
              top={el.top}
              width={el.width}
              title={
                el.hour === 0 && el.minute > 0
                  ? `${el.name} ${el.minute}분`
                  : el.hour > 0 && el.minute === 0
                  ? `${el.name} ${el.hour}시간`
                  : `${el.name} ${el.hour}시간 ${el.minute}분`
              }
            />
          ))}
        </Chart>
      </HourListAndChartContainer>
    </LogChartSection>
  );
}

export default LogChart;
