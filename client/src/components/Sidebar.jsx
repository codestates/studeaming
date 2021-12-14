import { useSelector } from "react-redux";
import styled from "styled-components";
import Badge from "./Badge";
import defaultImg from "../assets/images/img_profile_default.svg";

const Container = styled.div`
  width: 300px;
  height: calc(100vh - 80px);
  background-color: var(--color-main-0);
  display: flex;
  flex-direction: column;
  justify-content: column;
  align-items: center;
  padding: 1.2rem 0;

  .sidebar_section {
    width: 90%;
    padding: 2rem 1.2rem;
  }

  #following {
    flex: 1 0 auto;
  }

  section {
    display: inline-block;
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
    /* width: 100%;
    height: fit-content; */
    /* overflow: scroll; */

    /* hide scroll bar */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    ::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }
`;

function Sidebar({
  following,
  badges,
  openFollowingProfile,
  signoutHandler,
  editPwdHandler,
  withdrawalHandler,
}) {
  const { isSocialLogined, isGuestLogined } = useSelector(
    ({ userReducer }) => userReducer
  );

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
        <button id="signout" onClick={signoutHandler}>
          로그아웃
        </button>
        {!(isSocialLogined || isGuestLogined) && (
          <button id="edit_email" onClick={editPwdHandler}>
            비밀번호 수정
          </button>
        )}
        <button id="withdrawl" onClick={withdrawalHandler}>
          회원 탈퇴
        </button>
      </section>
    </Container>
  );
}

export default Sidebar;
