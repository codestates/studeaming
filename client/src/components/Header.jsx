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
  min-width: 330px;
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
  display: flex;
  gap: 3rem;
  margin-right: 2rem;
  margin-bottom: -4px;

  @media screen and (max-width: 768px) {
    margin-right: 1.5rem;
  }

  @media screen and (max-width: 480px) {
    gap: 1.5rem;
    margin-bottom: -2px;
  }
`;

const Video = styled(AiOutlineVideoCamera)`
  font-size: 1.4rem;
  color: var(--color-black-50);
  cursor: pointer;

  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

const User = styled(AiOutlineUser)`
  font-size: 1.4rem;
  color: var(--color-black-50);
  cursor: pointer;
`;

const HomeIcon = styled(AiOutlineHome)`
  font-size: 1.4rem;
  color: var(--color-black-50);
  cursor: pointer;
`;

const LoginIcon = styled(AiOutlineLogin)`
  font-size: 1.4rem;
  color: var(--color-black-50);
  cursor: pointer;
`;

function Header() {
  const { isLogin, isGuestLogined } = useSelector(
    ({ userReducer }) => userReducer
  );
  const { isSideLogOpen } = useSelector(({ sideLogReducer }) => sideLogReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sidelogHandler = () => {
    if (!isSideLogOpen) {
      dispatch(sideLogOpen(true));
      setTimeout(() => {
        gsap.from("#side_log", { x: -330, duration: 1 });
        gsap.to("#side_log", { opacity: 1, duration: 0.2 });
      }, 0);
    } else {
      gsap.to("#side_log", { x: -330, duration: 1 });
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
        duration: 1,
      });
      gsap.to("#side_log", {
        opacity: 1,
        duration: 0.1,
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
        <HomeIcon
          onClick={() => {
            navigate("/home");
          }}
          title="home"
        />
        {isLogin && !isGuestLogined && (
          <Video onClick={streamHandler} title="start studeaming" />
        )}
        {isLogin ? (
          <User onClick={navigateMypage} title="mypage" />
        ) : (
          <LoginIcon onClick={loginHandler} title="login" />
        )}
      </UserBox>
    </HeaderSection>
  );
}

export default Header;
