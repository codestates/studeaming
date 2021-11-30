import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import userAPI from "../api/user";
import { modalOff, notify } from "../store/actions";
import FollowBtn from "./FollowBtn";
import Badge from "./Badge";
import defaultImg from "../assets/images/img_profile_default.svg";
import dummyBadges from "../assets/dummy/bages";

const Container = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 280px 200px;
  grid-template-areas:
    "userInfo userInfo"
    "studyInfo badge";
  align-items: end;

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
  grid-area: badge;
  padding: 10px;
  background-color: var(--color-main-25);
  border-radius: 10px;
  width: 200px;
  height: 200px;

  @media screen and (max-width: 768px) {
    display: flex;
    justify-content: flex-start;
    margin-top: 1rem;
    background-color: transparent;
    width: 100%;
    padding: 5px 0;
    height: fit-content;
    overflow: scroll;

    /* hide scroll bar */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    ::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
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
  const [badges, setBadges] = useState(dummyBadges);
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

  const getBadges = (username) => {
    try {
      const res = userAPI.getOthersAchievement(username);
      // setBadges(res);
    } catch {}
  };

  useEffect(() => {
    getProfile(username);
    getBadges(username);
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
      <BadgeContainer>
        <Badge badges={badges} />
      </BadgeContainer>
    </Container>
  );
}

export default UserProfile;
