import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import {
  signinModalOpen,
  streamSettingModalOpen,
  loginStateChange,
} from "../store/actions/index";
import { faBars, faVideo, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HeaderSection = styled.section`
  width: 100%;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 0px 2px 20px rgba(141, 141, 141, 0.3);
  z-index: 1000;
`;

const Hamburger = styled(FontAwesomeIcon)`
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

const Video = styled(FontAwesomeIcon)`
  @media screen and (max-width: 768px) {
    display: none;
  }
  margin-right: 1.5rem;
  cursor: pointer;
`;

const User = styled(FontAwesomeIcon)`
  margin-left: 1.5rem;
  cursor: pointer;
`;

const Login = styled.span`
  cursor: pointer;
  font-size: 14px;
`;

function Header() {
  const { isLogin } = useSelector(({ loginReducer }) => loginReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      {isLogin && <Hamburger icon={faBars} />}
      <Logo onClick={navigateLanding}>studeaming</Logo>
      <UserBox>
        {isLogin ? (
          <>
            <Video icon={faVideo} onClick={streamHandler} />
            <User icon={faUser} onClick={navigateMypage} />
          </>
        ) : (
          <Login onClick={loginHandler}>로그인</Login>
        )}
      </UserBox>
    </HeaderSection>
  );
}

export default Header;
