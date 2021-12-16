import { useSelector } from "react-redux";
import styled from "styled-components";
import Badge from "./Badge";
import defaultImg from "../assets/images/img_profile_default.svg";

const Container = styled.div`
  width: 300px;
  height: 100%;
  background-color: var(--color-main-0);
  display: inline-flex;
  flex-direction: column;
  justify-content: column;
  align-items: center;
  padding: 1.2rem 0;

  .sidebar_section {
    width: 90%;
    padding: 1rem 1.2rem;
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

  @media screen and (max-height: 768px) {
    height: fit-content;
  }

  @media screen and (max-width: 768px) {
    width: 100vw;
    min-width: 370px;
    height: fit-content;
    order: 2;
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
  height: 100px;

  ::-webkit-scrollbar {
    display: none;
  }

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
    border-radius: 50%;
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
`;

const TabContainer = styled.div`
  width: 50px;

  @media screen and (max-width: 768px) {
    display: flex;
    align-items: flex-end;
    order: 1;
    margin-left: 20px;
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 40px;
    margin-left: 40px;
    background-color: var(--color-main-50);
    border-radius: 8px 8px 0 0;
    border-top: 0.6px solid var(--color-gray-bg-100);
    border-right: 3px solid var(--color-gray-bg-100);
    font-family: "Poppins-Regular";
    cursor: pointer;
    -ms-transform: rotate(90deg); /* IE 9 */
    -webkit-transform: rotate(90deg); /* Chrome, Safari, Opera */
    transform: rotate(90deg);
    transform-origin: 0 0;

    @media screen and (max-width: 768px) {
      padding: 10px 20px;
      margin-left: 0px;
      -ms-transform: none; /* IE 9 */
      -webkit-transform: none; /* Chrome, Safari, Opera */
      transform: none;
    }
  }

  .statistics-tab {
    margin-top: ${(props) =>
      props.selectedTab === "calendar" ? "70px" : "80px"};
    @media screen and (max-width: 768px) {
      margin-top: 0;
    }
  }

  .selected {
    background-color: var(--color-main-0);
    border-top: 0.6px solid var(--color-gray-bg-100);
    border-right: 3px solid var(--color-gray-bg-100);
    height: 50px;
    margin-left: 50px;
    border-bottom: none;

    @media screen and (max-width: 768px) {
      margin-left: 0px;
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
  selectedTab,
  tabHandler,
}) {
  const { isSocialLogined, isGuestLogined } = useSelector(
    ({ userReducer }) => userReducer
  );

  return (
    <>
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
      <TabContainer selectedTab={selectedTab}>
        <span
          className={`calendar-tab ${
            selectedTab === "calendar" ? "selected" : ""
          }`}
          onClick={() => tabHandler("calendar")}
        >
          calendar
        </span>
        <span
          className={`statistics-tab ${
            selectedTab === "statistics" ? "selected" : ""
          }`}
          onClick={() => tabHandler("statistics")}
        >
          graph
        </span>
      </TabContainer>
    </>
  );
}

export default Sidebar;
