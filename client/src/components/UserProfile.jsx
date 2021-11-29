import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import userAPI from "../api/user";
import { modalOff, notify } from "../store/actions";
import "./FollowBtn";
import defaultImg from "../assets/images/img_profile_default.svg";
import FollowBtn from "./FollowBtn";

const Container = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 250px 180px;
  grid-template-areas:
    "userInfo userInfo"
    "studyInfo badge";

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 320px;
  }
`;

const UserInfo = styled.section`
  /* background-color: lightblue; */
  grid-area: userInfo;
  display: flex;
  align-items: center;

  #profile_img {
    width: 60px;
  }

  .description {
    margin-left: 0.8rem;

    #username {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.4rem;
      display: inline-block;
    }

    #about {
      font-size: 0.8rem;
      color: var(--color-black-50);
    }
  }
`;

const Subheading = styled.h3`
  margin: 1.4rem 0 1rem;
`;

const StudyInfo = styled.section`
  /* background-color: gray; */
  grid-area: studyInfo;
  margin-right: 1rem;

  #studytime {
    font-size: 2rem;
    color: var(--color-black-50);
  }
`;

const Tag = styled.span`
  display: inline-block;
  padding: 0.6rem;
  margin: 0 0.4rem 0.4rem 0;
  /* border: 0.1px solid var(--color-black-25); */
  background-color: var(--color-main-25);
  border-radius: 10px;
  color: var(--color-black-25);
  font-size: 0.8rem;
`;

const BadgeContainer = styled.div`
  border: 1px solid gray; /* 임시 */
  grid-area: badge;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 768px) {
    margin-top: 1rem;
  }
`;

function UserProfile({ username }) {
  const [profile, setProfile] = useState({
    username: "전자전기",
    profileImg: "",
    about: "안녕하세요, 전자전기공학부 대학생입니다.",
    studylogList: [
      "반도체공학",
      "회로설계",
      "스페인어",
      "디지털 영상처리",
      "자동제어",
      "컴퓨터구조",
    ],
    studyTime: 1890,
  });
  const dispatch = useDispatch();

  const getProfile = (username) => {
    try {
      const res = userAPI.getOthersInfo(username);
      // setProfile(res);
    } catch {
      modalOff();
      dispatch(notify("회원 정보를 불러오지 못했습니다."));
    }
  };

  useEffect(() => {
    getProfile(username);
  }, []);

  return (
    <Container>
      <UserInfo>
        <img src={profile.profileImg || defaultImg} id="profile_img" />
        <div className="description">
          <div id="username">{profile.username}</div>
          <FollowBtn></FollowBtn>
          <div id="about">{profile.about}</div>
        </div>
      </UserInfo>
      <StudyInfo>
        <Subheading>최근에 한 공부</Subheading>
        {profile.studylogList.map((log) => {
          return <Tag>{log}</Tag>;
        })}
        <Subheading>한 달 동안 공부한 시간</Subheading>
        <span id="studytime">
          {Math.floor(profile.studyTime / 60)}h {profile.studyTime % 60}m
        </span>
      </StudyInfo>
      <BadgeContainer />
    </Container>
  );
}

export default UserProfile;
