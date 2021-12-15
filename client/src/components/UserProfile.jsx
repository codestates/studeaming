import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import userAPI from "../api/user";
import { modalOff } from "../store/actions";
import FollowBtn from "./FollowBtn";
import Badge from "./Badge";
import defaultImg from "../assets/images/img_profile_default.svg";

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
  margin: 1.2rem 0 0.8rem;
`;

const StudyInfo = styled.section`
  grid-area: studyInfo;
  margin-right: 1rem;

  #studytime {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-black-25);
  }
`;

const TagContainer = styled.div`
  height: 30px;

  span {
    font-size: 0.8rem;
    color: var(--color-black-25);
  }

  @media screen and (max-width: 768px) {
    hieght: fit-content;
  }
`;

const Tag = styled.span`
  display: inline-block;
  padding: 0.6rem;
  margin: 0 0.4rem 0.4rem 0;
  background-color: var(--color-main-0);
  border-radius: 10px;
  color: var(--color-black-25);
  font-size: 0.8rem;
`;

const BadgeContainer = styled.div`
  grid-area: badge;
  padding: 10px;
  background-color: var(--color-main-0);
  border-radius: 10px;
  width: 200px;
  height: 200px;

  @media screen and (max-width: 768px) {
    display: flex;
    justify-content: flex-start;
    margin-top: 1rem;
    background-color: transparent;
    padding: 5px 0;
    display: none;
  }
`;

function UserProfile({ username }) {
  const { follows } = useSelector(({ followReducer }) => followReducer);
  const [profile, setProfile] = useState({
    username: "",
    profileImg: "",
    about: "",
    studylogList: [],
    studyTime: 0,
  });
  const [badges, setBadges] = useState([]);

  const getProfile = async (username) => {
    try {
      const res = await userAPI.getOthersInfo(username);
      setProfile(res.data.profile);
    } catch {
      modalOff();
    }
  };

  const getBadges = async (username) => {
    try {
      const res = await userAPI.getOthersAchievement(username);
      setBadges(res.data.achievements);
    } catch {
      modalOff();
    }
  };

  useEffect(() => {
    getProfile(username);
    getBadges(username);
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <UserInfo>
        <img
          src={profile.profileImg || defaultImg}
          id="profile_img"
          alt="profile"
        />
        <div className="description">
          <div id="username">{profile.username}</div>
          <FollowBtn username={username} />
          <div id="about">{profile.about}</div>
        </div>
      </UserInfo>
      <StudyInfo>
        <Subheading>최근에 한 공부</Subheading>
        <TagContainer>
          {profile.studylogList.length ? (
            profile.studylogList.map((log, idx) => {
              return <Tag key={idx}>{log}</Tag>;
            })
          ) : (
            <span>아직 공부를 시작하지 않았네요 😔</span>
          )}
        </TagContainer>
        <Subheading>한 달 동안 공부한 시간</Subheading>
        <span id="studytime">
          {Math.floor(profile.studyTime / 60)}시간 {profile.studyTime % 60}분
        </span>
      </StudyInfo>
      <BadgeContainer>
        <Badge badges={badges} isOthersProfile="true" />
      </BadgeContainer>
    </Container>
  );
}

export default UserProfile;
