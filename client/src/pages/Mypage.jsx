import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import styled from "styled-components";
import statisticsAPI from "../api/statistics";
import userAPI from "../api/user";
import authAPI from "../api/auth";
import {
  loginStateChange,
  pwdEditModalOpen,
  withdrawalModalOpen,
  profileModalOpen,
  signinModalOpen,
} from "../store/actions";
import Sidebar from "../components/Sidebar";
import Calendar from "../components/Calendar";

const Container = styled.div`
  display: flex;
  justify-content: flex-start;

  .monthly-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100vw - 300px);
    height: calc(100vh - 80px);

    @media screen and (max-width: 768px) {
      width: 100vw;
      height: 70vh;
      min-width: 330px;
      order: -1;
    }
  }

  @media screen and (max-width: 768px) {
    justify-content: flex-end;
    flex-direction: column;
  }

  @media screen and (max-width: 480px) {
    height: calc(100vh - 60px);
  }
`;

const MonthlyBody = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1000px;
  min-width: 330px;
  padding: 2.4rem 2.4rem;
  position: relative;
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #study_time_section {
    display: flex;
    align-items: center;
    justify-content: end;
    margin-bottom: 0.2rem;
    min-width: 330px;
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

    @media (min-width: 768px) and (max-width: 833px) {
      font-size: 1.8rem;
    }
  }
`;

function Mypage() {
  const [studyTime, setStudyTime] = useState({ hour: 0, minute: 0 });
  const [studeamingTime, setStudeamingTime] = useState({ hour: 0, minute: 0 });
  const [following, setFollowing] = useState([]);
  const [badges, setBadges] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const getFollowing = async () => {
    try {
      const res = await userAPI.getFollows();
      setFollowing(res.data.studeamerList);
    } catch {
      navigate("/home");
      dispatch(signinModalOpen(true));
    }
  };

  const getBadge = async () => {
    try {
      const res = await userAPI.getAchievement();
      setBadges(res.data.achievements);
    } catch {
      navigate("/home");
      dispatch(signinModalOpen(true));
    }
  };

  const openFollowingProfile = (username) => {
    dispatch(profileModalOpen(true, username));
  };

  const signoutHandler = () => {
    authAPI
      .signout()
      .then(() => {
        dispatch(loginStateChange(false));
        navigate("/home");
      })
      .catch(() => {});
  };

  const editPwdHandler = () => {
    dispatch(pwdEditModalOpen(true));
  };

  const withdrawalHandler = () => {
    dispatch(withdrawalModalOpen(true));
  };

  useEffect(() => {
    getTotalTime();
    getFollowing();
    getBadge();
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <Sidebar
        following={following}
        badges={badges}
        openFollowingProfile={openFollowingProfile}
        signoutHandler={signoutHandler}
        editPwdHandler={editPwdHandler}
        withdrawalHandler={withdrawalHandler}
      />
      <div className="monthly-container">
        <MonthlyBody>
          <section id="study_time_section">
            <span className="study_time">
              <span className="hour_title">총 스터디밍 시간</span>
              <span className="study_hour">
                {studeamingTime.hour}시간 {studeamingTime.minute}분
              </span>
            </span>
            <div id="division_line"></div>
            <span className="study_time">
              <span className="hour_title">총 공부 시간</span>
              <span className="study_hour">
                {studyTime.hour}시간 {studyTime.minute}분
              </span>
            </span>
          </section>
          <Calendar></Calendar>
        </MonthlyBody>
      </div>
    </Container>
  );
}

export default Mypage;
