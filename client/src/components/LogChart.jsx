import { useState, useEffect } from "react";
import styled from "styled-components";
import logAPI from "../api/studyLog";

const LogChartSection = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

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
    height: 96%;
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
  height: 96%;
  position: relative;
  overflow: hidden;
`;

const Hour = styled.div`
  width: 100%;
  height: calc(100% / 24);
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

function LogChart() {
  const date = new Date();
  const [log, setLog] = useState([]);
  const [studylogList, setStudylogList] = useState([
    { name: "영어", color: "#ffaeae", startedAt: 20, finishedAt: 80 },
    { name: "휴식", color: "#a5c7e5", startedAt: 80, finishedAt: 100 },
    { name: "수학", color: "#fdd4ae", startedAt: 100, finishedAt: 160 },
    { name: "휴식", color: "#a5c7e5", startedAt: 160, finishedAt: 190 },
    { name: "수학", color: "#fdd4ae", startedAt: 190, finishedAt: 250 },
    { name: "휴식", color: "#a5c7e5", startedAt: 250, finishedAt: 280 },
    { name: "국어", color: "#b4e29e", startedAt: 280, finishedAt: 350 },
    { name: "휴식", color: "#a5c7e5", startedAt: 350, finishedAt: 360 },
    { name: "과학", color: "#565781", startedAt: 360, finishedAt: 440 },
    { name: "휴식", color: "#a5c7e5", startedAt: 440, finishedAt: 460 },
    { name: "사회", color: "#b094f2", startedAt: 460, finishedAt: 540 },
    { name: "사회", color: "#b094f2", startedAt: 460, finishedAt: 590 },
    { name: "사회", color: "#b094f2", startedAt: 460, finishedAt: 620 },
  ]);
  const minute = ["", 10, 20, 30, 40, 50, 60];
  const hour = new Array(24).fill(0).map((_, idx) => idx);

  const fillLog = () => {
    const newLog = [];
    for (let i = 0; i < studylogList.length; i++) {
      const studylog = studylogList[i];
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
      setLog([...log, ...newLog]);
    }
  };

  const getLogsHandler = () => {
    logAPI.getLogs(date.getTimezoneOffset()).then((res) => {
      const compileStudylogList = res.data.studylogList.map((list) => {
        const utcStart = list.startedAt * 6000;
        const utcFinish = list.finishedAt * 6000;
        const startedAt =
          new Date(utcStart).getHours() * 60 + new Date(utcStart).getMinutes();
        const finishedAt =
          new Date(utcFinish).getHours() * 60 +
          new Date(utcFinish).getMinutes();
        const newList = { ...list, startedAt, finishedAt };
        return newList;
      });
      setStudylogList(compileStudylogList);
      fillLog();
    });
  };

  useEffect(() => {
    fillLog(); //서버 연결되면 지우기
    getLogsHandler();
  }, [studylogList]);

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
            <Hour key={idx}>
              <Log
                color={log[idx].color}
                left={log[idx].left}
                top={log[idx].top}
                width={log[idx].width}
                title={
                  log[idx].hour === 0 && log[idx].minute > 0
                    ? `${log[idx].name} ${log[idx].minute}분`
                    : log[idx].hour > 0 && log[idx].minute === 0
                    ? `${log[idx].name} ${log[idx].hour}시간`
                    : `${log[idx].name} ${log[idx].hour}시간 ${log[idx].minute}분`
                }
              />
            </Hour>
          ))}
        </Chart>
      </HourListAndChartContainer>
    </LogChartSection>
  );
}

export default LogChart;
