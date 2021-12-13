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
import project_logo_mobile from "../assets/images/project_logo_mobile.svg";
import project_logo_web from "../assets/images/project_logo_web.svg";

const HeaderSection = styled.section`
  width: 100%;
  height: 80px;
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  left: 0;
  border-bottom: 1px solid rgba(141, 141, 141, 0.3);
  background-color: white;
  z-index: 1000;

  @media screen and (max-width: 480px) {
    height: 60px;
  }
`;

const Hamburger = styled(AiOutlineMenu)`
  cursor: pointer;
  font-size: 1.4rem;
  margin-left: 2rem;
  color: var(--color-black-50);

  @media screen and (max-width: 768px) {
    margin-left: 1rem;
  }

  @media screen and (max-width: 480px) {
    display: none;
  }
`;

const HamburgerDown = styled(AiOutlineMenu)`
  display: none;
  font-size: 1.4rem;
  color: var(--color-black-50);

  @media screen and (max-width: 480px) {
    display: flex;
    cursor: pointer;
    margin-left: 1rem;
  }
`;

const HamburgerUp = styled(IoIosArrowUp)`
  display: none;
  font-size: 1.4rem;
  color: var(--color-black-50);

  @media screen and (max-width: 480px) {
    display: flex;
    cursor: pointer;
    margin-left: 1rem;
  }
`;

const WebLogo = styled.div`
  width: 180px;
  height: 33px;
  position: absolute;
  left: 50%;
  top: 0%;
  margin-top: 25px;
  -webkit-transform: translate(-50%, 0);
  -ms-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  background-image: url(${(props) => props.img});
  background-repeat: no-repeat;
  cursor: pointer;

  @media screen and (max-width: 480px) {
    display: none;
  }
`;

const MobileLogo = styled(WebLogo)`
  display: none;
  width: 126px;
  height: 25px;
  margin-top: 20px;

  @media screen and (max-width: 480px) {
    display: block;
  }
`;

const UserBox = styled.div`
  margin-right: 3rem;
  margin-bottom: -4px;

  @media screen and (max-width: 768px) {
    margin-right: 1.5rem;
  }
`;

const Video = styled(AiOutlineVideoCamera)`
  font-size: 1.4rem;
  color: var(--color-black-50);

  @media screen and (max-width: 1024px) {
    display: none;
  }
  margin: 0 1.75rem;
  cursor: pointer;
`;

const User = styled(AiOutlineUser)`
  margin-left: 1.75rem;
  cursor: pointer;
  font-size: 1.4rem;
  color: var(--color-black-50);

  @media screen and (max-width: 420px) {
    margin-left: 0.75rem;
  }
`;

const HomeIcon = styled(AiOutlineHome)`
  cursor: pointer;
  margin-right: 1.75rem;
  font-size: 1.4rem;
  color: var(--color-black-50);

  @media screen and (max-width: 420px) {
    margin-right: 0.5rem;
  }
`;

const LoginIcon = styled(AiOutlineLogin)`
  cursor: pointer;
  margin-left: 1.75rem;
  font-size: 1.4rem;
  color: var(--color-black-50);

  @media screen and (max-width: 420px) {
    margin-left: 0.5rem;
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
      <div className="logo_container">
        <WebLogo onClick={navigateLanding} img={project_logo_mobile} />
        <MobileLogo onClick={navigateLanding} img={project_logo_web} />
      </div>
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
            <HomeIcon
              onClick={() => {
                navigate("/home");
              }}
              title="home"
            />
            <LoginIcon onClick={loginHandler} title="login" />
          </>
        )}
      </UserBox>
    </HeaderSection>
  );
}

export default Header;
