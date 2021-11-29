import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import userAPI from "../api/user";
import { pwdEditModalOpen, profileModalOpen, notify } from "../store/actions";
import Badge from "./Badge";
import defaultImg from "../assets/images/img_profile_default.svg";

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
    padding: 2rem;
  }

  #following {
    flex: 1 0 auto;
  }

  button {
    display: block;
    padding: 0.6rem 0;
    :hover {
      font-weight: 600;
    }
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
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
    width: 36px;
    height: 36px;
    margin-right: 0.8rem;
  }
`;

const Badges_temp = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 10px;
  background-color: var(--color-main-50);
`;

function Sidebar() {
  const [following, setFollowing] = useState([
    { profileImg: "", username: "김코딩" },
    { profileImg: "", username: "박해커" },
    { profileImg: "", username: "이보안" },
  ]);
  const dispatch = useDispatch();

  const getFollowing = () => {
    try {
      const res = userAPI.getFollows();
      // setFollowing(res);
    } catch {
      dispatch(notify("로그인이 만료되었습니다."));
    }
  };

  const getBadge = () => {
    try {
    } catch {}
  };

  const openFollowingProfile = (username) => {
    dispatch(profileModalOpen(true, username));
  };

  const editPwdHandler = () => {
    if ("자체 로그인 회원이라면") {
      dispatch(pwdEditModalOpen(true));
    } else {
      dispatch(notify("비밀번호를 변경할 수 없습니다."));
    }
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
          {following.map((studeamer) => {
            return (
              <li onClick={() => openFollowingProfile(studeamer.username)}>
                <img
                  src={studeamer.profileImg || defaultImg}
                  alt="profile_image"
                />
                <span>{studeamer.username}</span>
              </li>
            );
          })}
        </Following>
      </section>
      <section id="badges" className="sidebar_section">
        <SectionTitle>내 훈장</SectionTitle>
        <Badge />
      </section>
      <section id="user_edit" className="sidebar_section">
        <button id="edit_email" onClick={editPwdHandler}>
          비밀번호 수정
        </button>
        <button id="withdrawl">회원 탈퇴</button>
      </section>
    </Container>
  );
}

export default Sidebar;
