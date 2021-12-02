import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import {
  signinModalOpen,
  streamSettingModalOpen,
  sideLogOpen,
} from "../store/actions/index";
import {
  AiOutlineMenu,
  AiOutlineVideoCamera,
  AiOutlineUser,
} from "react-icons/ai";
import { gsap } from "gsap";

const HeaderSection = styled.section`
  width: 100%;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0;
  left: 0;
  border-bottom: 1px solid rgba(141, 141, 141, 0.3);
  background-color: white;
  z-index: 1000;
`;

const Hamburger = styled(AiOutlineMenu)`
  position: fixed;
  left: 1.5rem;
  cursor: pointer;
`;

const Logo = styled.span`
  font-size: 18px;
  cursor: pointer;
`;

const UserBox = styled.div`
  @media screen and (max-width: 768px) {
    right: 2rem;
  }
  position: fixed;
  right: 3rem;
`;

const Video = styled(AiOutlineVideoCamera)`
  @media screen and (max-width: 768px) {
    display: none;
  }
  margin-right: 1.5rem;
  cursor: pointer;
`;

const User = styled(AiOutlineUser)`
  margin-left: 1.5rem;
  cursor: pointer;
`;

const Login = styled.span`
  cursor: pointer;
  font-size: 14px;
`;

function Header() {
  const { isLogin } = useSelector(({ userReducer }) => userReducer);
  const { isSideLogOpen } = useSelector(({ sideLogReducer }) => sideLogReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sidelogHandler = () => {
    if (!isSideLogOpen) {
      dispatch(sideLogOpen(true));
    } else {
      gsap.to("#side_log", { x: -480, duration: 1 });
      setTimeout(() => {
        dispatch(sideLogOpen(false));
      }, 1000);
    }
  };

  const navigateLanding = () => {
    navigate("/");
  };

  const loginHandler = () => {
    dispatch(signinModalOpen(true));
  };

  const streamHandler = () => {
    dispatch(streamSettingModalOpen(true));
  };

  const navigateMypage = () => {
    navigate("/mypage");
  };

  return (
    <HeaderSection>
      {isLogin || <Hamburger onClick={sidelogHandler} title="study log" />}
      <Logo onClick={navigateLanding}>studeaming</Logo>
      <UserBox>
        {!isLogin ? (
          <>
            <Video onClick={streamHandler} title="start studeaming" />
            <User onClick={navigateMypage} title="mypage" />
          </>
        ) : (
          <Login onClick={loginHandler}>로그인</Login>
        )}
      </UserBox>
    </HeaderSection>
  );
}

export default Header;
