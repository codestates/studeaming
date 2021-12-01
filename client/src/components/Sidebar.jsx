import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import userAPI from "../api/user";
import {
  pwdEditModalOpen,
  withdrawalModalOpen,
  profileModalOpen,
  notify,
} from "../store/actions";
import Badge from "./Badge";
import defaultImg from "../assets/images/img_profile_default.svg";
import dummyBadges from "../assets/dummy/bages";

const Container = styled.div`
  width: 300px;
  height: calc(100vh - 61.69px);
  background-color: var(--color-main-25);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 1.2rem 0;

  .sidebar_section {
    width: 90%;
    padding: 2rem 1.2rem;
  }

  #following {
    flex: 1 0 auto;
  }

  button {
    display: block;
    padding: 0.6rem 0;
    font-size: 0.9rem;
    :hover {
      font-weight: 600;
    }
  }

  @media screen and (max-width: 768px) {
    width: 100vw;
    min-width: 370px;
    height: fit-content;
    min-witdth: 400px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1.2rem;
`;

const Following = styled.ul`
  display: block;
  overflow: scroll;

  li {
    display: flex;
    align-items: center;
    margin-bottom: 0.8rem;
    cursor: pointer;
  }

  img {
    width: 32px;
    height: 32px;
    margin-right: 0.8rem;
  }

  .following_name {
    font-size: 0.9rem;
  }

  @media screen and (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, 120px);
  }
`;

const BadgeContainer = styled.div`
  width: 220px;
  height: 220px;

  @media screen and (max-width: 768px) {
    width: 100%;
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

function Sidebar() {
  const { isSocialLogined } = useSelector(({ userReducer }) => userReducer);
  const [following, setFollowing] = useState([
    { profileImg: "", username: "김코딩" },
    { profileImg: "", username: "박해커" },
    { profileImg: "", username: "이보안" },
  ]);
  const [badges, setBadges] = useState(dummyBadges);
  const dispatch = useDispatch();

  const getFollowing = async () => {
    try {
      const res = await userAPI.getFollows();
      // setFollowing(res);
    } catch {
      dispatch(notify("로그인이 만료되었습니다."));
    }
  };

  const getBadge = async () => {
    try {
      const res = await userAPI.getAchievement();
      // setBadges(res)
    } catch {
      dispatch(notify("로그인이 만료되었습니다."));
    }
  };

  const openFollowingProfile = (username) => {
    dispatch(profileModalOpen(true, username));
  };

  const editPwdHandler = () => {
    if (!isSocialLogined) {
      dispatch(pwdEditModalOpen(true));
    } else {
      dispatch(notify("비밀번호를 변경할 수 없습니다."));
    }
  };

  const withdrawalHandler = () => {
    dispatch(withdrawalModalOpen(true));
  };

  useEffect(() => {
    getFollowing();
    getBadge();
  }, []);

  return (
    <Container>
      <section id="following" className="sidebar_section">
        <SectionTitle>즐겨찾는 스터디머</SectionTitle>
        <Following>
          {following.map((studeamer, idx) => {
            return (
              <li
                key={idx}
                onClick={() => openFollowingProfile(studeamer.username)}
              >
                <img
                  src={studeamer.profileImg || defaultImg}
                  alt="profile_image"
                />
                <span className="following_name">{studeamer.username}</span>
              </li>
            );
          })}
        </Following>
      </section>
      <section id="badges" className="sidebar_section">
        <SectionTitle>내 훈장</SectionTitle>
        <BadgeContainer>
          <Badge badges={badges} />
        </BadgeContainer>
      </section>
      <section id="user_edit" className="sidebar_section">
        <button id="edit_email" onClick={editPwdHandler}>
          비밀번호 수정
        </button>
        <button id="withdrawl" onClick={withdrawalHandler}>
          회원 탈퇴
        </button>
      </section>
    </Container>
  );
}

export default Sidebar;
