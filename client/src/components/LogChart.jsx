import { useState, useEffect } from "react";
import styled from "styled-components";
import logAPI from "../api/studyLog";

const LogChartSection = styled.section`
  width: 240px;
  height: 500px;
  display: flex;
  flex-direction: column;

  > .ten_minute {
    display: flex;
    align-items: center;
    width: 250px;
    height: 20px;

    > .ten_minute_block {
      width: 35px;
      text-align: center;
      font-size: 14px;
    }
  }

  > .hour_block_wrapper {
    display: flex;

    > .hour {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 35.71px;
      height: 480px;

      > .hour_block {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 35px;
        height: 20px;
        border-right: 1px solid;
        font-size: 12px;
        padding-top: 2px;
      }
    }
  }
`;

const Chart = styled.section`
  width: 240px;
  height: 480px;
  position: relative;
  overflow: hidden;
`;

const Hour = styled.div`
  width: 210px;
  height: 20px;
`;

const Log = styled.div`
  position: absolute;
  margin-top: 5px;
  height: 10px;
  width: ${(props) => props.width}px;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  background-color: ${(props) => props.color};

  :hover {
    box-shadow: 0 0 0.5px;
  }
`;

function LogChart() {
  const date = new Date();
  const [log, setLog] = useState([]);
  const [studylogList, setStudylogList] = useState([
    { name: "영어", color: "#ffaeae", startedAt: 20, finishedAt: 350 },
    { name: "휴식", color: "#a5c7e5", startedAt: 350, finishedAt: 380 },
    { name: "수학", color: "#fdd4ae", startedAt: 380, finishedAt: 440 },
    { name: "휴식", color: "#a5c7e5", startedAt: 440, finishedAt: 470 },
    { name: "국어", color: "#b4e29e", startedAt: 470, finishedAt: 590 },
    { name: "사회", color: "#565781", startedAt: 900, finishedAt: 960 },
    { name: "휴식", color: "#a5c7e5", startedAt: 960, finishedAt: 990 },
    { name: "사회", color: "#565781", startedAt: 990, finishedAt: 1070 },
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
            top: i * 20,
            left: (start % 60) * 3.5,
            width: (finish - start) * 3.5,
          });
        } else if (i > startTime && i !== finishTime) {
          newLog.push({
            name: studylog.name,
            color: studylog.color,
            top: i * 20,
            left: 0,
            width: 60 * 3.5,
          });
        } else if (i === finishTime) {
          newLog.push({
            name: studylog.name,
            color: studylog.color,
            top: i * 20,
            left: 0,
            width: (finish - 60 * i) * 3.5,
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
    /*
    10분마다 요청 보내기 보낼 필요가 없을 것 같다.
    const interval = setInterval(() => {
      getLogsHandler();
    }, 600000);
    return () => clearInterval(interval);
    */
  }, [studylogList]);

  return (
    <LogChartSection>
      <div className="ten_minute">
        {minute.map((el, idx) => (
          <div key={idx} className="ten_minute_block">
            {el}
          </div>
        ))}
      </div>
      <div className="hour_block_wrapper">
        <div className="hour">
          {hour.map((el, idx) => (
            <div className="hour_block" key={idx}>
              {el}
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
                title={log[idx].name}
              />
            </Hour>
          ))}
        </Chart>
      </div>
    </LogChartSection>
  );
}

export default LogChart;
