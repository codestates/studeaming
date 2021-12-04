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
  AiOutlineHome,
  AiOutlineLogin,
} from "react-icons/ai";
import { IoIosArrowUp } from "react-icons/io";
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

  @media screen and (max-width: 480px) {
    display: none;
  }
`;

const HamburgerDown = styled(AiOutlineMenu)`
  display: none;

  @media screen and (max-width: 480px) {
    display: flex;
    position: fixed;
    left: 1.5rem;
    cursor: pointer;
  }
`;

const HamburgerUp = styled(IoIosArrowUp)`
  display: none;

  @media screen and (max-width: 480px) {
    display: flex;
    position: fixed;
    left: 1.5rem;
    cursor: pointer;
  }
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
  @media screen and (max-width: 1024px) {
    display: none;
  }
  margin-right: 1.5rem;
  margin-left: 1.5rem;
  cursor: pointer;
`;

const User = styled(AiOutlineUser)`
  margin-left: 1.5rem;
  cursor: pointer;

  @media screen and (max-width: 420px) {
    margin-left: 0.75rem;
  }
`;

const HomeIcon = styled(AiOutlineHome)`
  cursor: pointer;
  margin-right: 1.5rem;

  @media screen and (max-width: 420px) {
    margin-right: 0.75rem;
  }
`;

const LoginIcon = styled(AiOutlineLogin)`
  cursor: pointer;
  margin-left: 1.5rem;

  @media screen and (max-width: 420px) {
    margin-left: 0.75rem;
  }
`;

function Header() {
  const { isLogin } = useSelector(({ userReducer }) => userReducer);
  const { isSideLogOpen } = useSelector(({ sideLogReducer }) => sideLogReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sidelogHandler = () => {
    if (!isSideLogOpen) {
      dispatch(sideLogOpen(true));
      setTimeout(() => {
        gsap.from("#side_log", { x: -480, duration: 1 });
      }, 0);
    } else {
      gsap.to("#side_log", { x: -480, duration: 1 });
      setTimeout(() => {
        dispatch(sideLogOpen(false));
      }, 500);
    }
  };

  const sidelogDownHandler = () => {
    dispatch(sideLogOpen(true));
    setTimeout(() => {
      gsap.from("#side_log", {
        y: -400,
      });
    }, 0);
  };

  const sidelogUpHandler = () => {
    gsap.to("#side_log", { y: -400, duration: 1 });
    setTimeout(() => {
      dispatch(sideLogOpen(false));
    }, 500);
  };

  const navigateLanding = () => {
    navigate("/");
  };

  const loginHandler = () => {
    dispatch(signinModalOpen(true));
  };

  const streamHandler = () => {
    navigate("/Streamer");
    dispatch(streamSettingModalOpen(true));
  };

  const navigateMypage = () => {
    navigate("/mypage");
  };

  return (
    <HeaderSection>
      {isSideLogOpen ? (
        <>
          <Hamburger />
          <HamburgerUp onClick={sidelogUpHandler} />
        </>
      ) : (
        <>
          <Hamburger
            className="hamburger"
            onClick={sidelogHandler}
            title="study log"
          />
          <HamburgerDown onClick={sidelogDownHandler} title="study log" />
        </>
      )}
      <Logo onClick={navigateLanding}>studeaming</Logo>
      <UserBox>
        {isLogin ? (
          <>
            <HomeIcon
              onClick={() => {
                navigate("/home");
              }}
              title="home"
            />
            <Video onClick={streamHandler} title="start studeaming" />
            <User onClick={navigateMypage} title="mypage" />
          </>
        ) : (
          <>
            {/* <HomeIcon
              onClick={() => {
                navigate("/home");
              }}
              title="home"
            /> */}
            <Video onClick={streamHandler} title="start studeaming" />
            <LoginIcon onClick={loginHandler} title="login" />
          </>
        )}
      </UserBox>
    </HeaderSection>
  );
}

export default Header;
