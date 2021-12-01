import { useState, useEffect } from "react";
import styled from "styled-components";
import statisticsAPI from "../api/statistics";
import Sidebar from "../components/Sidebar";
import Calendar from "../components/Calendar";

const Container = styled.div`
  display: flex;
  justify-content: flex-start;

  @media screen and (max-width: 768px) {
    justify-content: flex-end;
    flex-direction: column;
  }
`;

const MonthlyContainer = styled.div`
  width: calc(100vw - 300px);
  height: calc(100vh - 61.69px);
  padding: 2rem 1rem;
  position: relative;

  @media screen and (max-width: 768px) {
    width: 100vw;
    min-width: 370px;
    order: -1;
  }

  #study_time_section {
    display: flex;
    align-items: center;
    justify-content: end;
    margin-bottom: 1rem;
    min-width: 370px;
    height: 14%;
  }

  #division_line {
    width: 1px;
    height: 54px;
    background-color: var(--color-black-25);
  }

  .study_time {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 0 1.6rem;
  }

  .hour_title {
    display: inline-block;
    font-weight: 300;
    margin-bottom: 0.5rem;
  }

  .study_hour {
    display: inline-block;
    font-size: 2.2rem;
    font-family: "Poppins-Regular", "OpenSans";
    font-weight: 700;
    color: var(--color-black-25);
  }
`;

function Mypage() {
  const [studyTime, setStudyTime] = useState({ hour: 121, minute: 15 });
  const [studeamingTime, setStudeamingTime] = useState({
    hour: 62,
    minute: 37,
  });

  const getTotalTime = () => {
    statisticsAPI
      .getTotalTime()
      .then((res) => {
        const { studyTime, studeamingTime } = res.data;
        const studyHour = Math.floor(studyTime / 60);
        const studyMinute = studyTime % 60;
        const studeamingHour = Math.floor(studeamingTime / 60);
        const studeamingMinute = studeamingTime % 60;

        setStudyTime({ hour: studyHour, minute: studyMinute });
        setStudeamingTime({ hour: studeamingHour, minute: studeamingMinute });
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getTotalTime();
  }, []);

  return (
    <Container>
      <Sidebar />
      <MonthlyContainer>
        <section id="study_time_section">
          <span className="study_time">
            <span className="hour_title">총 스터디밍 시간</span>
            <span className="study_hour">
              {studeamingTime.hour}h {studeamingTime.minute}m
            </span>
          </span>
          <div id="division_line"></div>
          <span className="study_time">
            <span className="hour_title">총 공부 시간</span>
            <span className="study_hour">
              {studyTime.hour}h {studyTime.minute}m
            </span>
          </span>
        </section>
        <Calendar></Calendar>
      </MonthlyContainer>
    </Container>
  );
}

export default Mypage;
