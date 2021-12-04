import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  getUserInfo,
  loginStateChange,
  signinModalOpen,
  signupModalOpen,
  modalOff,
  notify,
  getFollows,
} from "../store/actions/index";
import styled from "styled-components";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";
import { AuthContainer, Title, Input } from "./reusableStyle";
import authAPI from "../api/auth";
import userAPI from "../api/user";
import google from "../assets/images/btn_google.svg";
import kakao from "../assets/images/btn_kakao.svg";

const InputBox = styled.div`
  position: relative;
  width: 220px;
  :first-of-type {
    margin: 25px 0px 10px 0px;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  position: absolute;
  height: 12px;
  right: 8px;
  top: calc(50% - 9px);
`;

const SignupBtn = styled.div`
  margin: 15px 0px 25px 0px;
  font-size: 14px;
  cursor: pointer;
  :hover {
    color: #656bff;
    font-weight: 700;
  }
`;

const SocialBtnBox = styled.div`
  width: 100px;
  display: flex;
  justify-content: space-between;
  margin: 10px 0px 5px 0px;
`;

const SocialBtn = styled.div`
  width: 40px;
  height: 40px;
  cursor: pointer;
  border: 1px solid #f5f5f5;
  border-radius: 5px;
  img {
    object-fit: cover;
  }
  :hover {
    border: none;
    box-shadow: 0px 0px 5px rgba(144, 144, 144, 0.6);
  }
`;

const ButtonContainer = styled.div`
  width: 220px;
  margin-top: 40px;
`;

function Signin() {
  const [signinInfo, setSigninInfo] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const regExpEmail =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

  const handleInputValue = (key) => (e) => {
    setSigninInfo({ ...signinInfo, [key]: e.target.value });
  };

  const signinHandler = () => {
    if (!signinInfo.email.length) {
      dispatch(notify("이메일을 입력해주세요."));
    } else if (!signinInfo.password.length) {
      dispatch(notify("비밀번호를 입력해주세요."));
    } else if (!regExpEmail.test(signinInfo.email)) {
      dispatch(notify("올바른 이메일 형식이 아닙니다."));
    } else {
      // signin request
      authAPI
        .signin(signinInfo.email, signinInfo.password)
        .then(() => {
          dispatch(loginStateChange(true));
          dispatch(modalOff());
          return userAPI.getUserInfo();
        })
        .then((res) => {
          // set userinfo state
          const { username, profileImg, about, studeaming } = res.data.user;
          const data = { username, profileImg, about, studeaming };
          dispatch(getUserInfo(data));
          return userAPI.getFollows();
        })
        .then((res) => {
          // set follows state
          dispatch(getFollows(res.data.studeamerList));
        })
        .catch((err) => {
          if (err.response.status === 401) {
            if (err.response.data.message === "Verify email address") {
              dispatch(notify("이메일 인증을 완료해주세요."));
            } else {
              dispatch(notify("아이디와 비밀번호를 다시 확인해주세요."));
            }
          } else {
            dispatch(notify("새로고침 후 다시 시도해주세요."));
          }
        });
    }
  };
  const openSignup = () => {
    dispatch(signinModalOpen(false));
    dispatch(signupModalOpen(true));
  };

  const googleBtnClick = () => {
    window.location.assign(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_REST_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email&state=google`
    );
  };

  const kakaoBtnClick = () => {
    window.location.assign(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_REST_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code&state=kakao`
    );
  };

  return (
    <AuthContainer>
      <Title>로그인</Title>
      <InputBox>
        <Input
          type="text"
          placeholder="이메일"
          onChange={handleInputValue("email")}
          onKeyUp={(e) => {
            e.key === "Enter" && signinHandler();
          }}
        />
        <Icon icon={faUser} />
      </InputBox>
      <InputBox>
        <Input
          type="password"
          placeholder="비밀번호"
          onChange={handleInputValue("password")}
          onKeyUp={(e) => {
            e.key === "Enter" && signinHandler();
          }}
        />
        <Icon icon={faLock} />
      </InputBox>
      <ButtonContainer>
        <Button message="로그인" clickEvent={signinHandler}></Button>
      </ButtonContainer>
      <SignupBtn onClick={openSignup}>회원가입</SignupBtn>
      <SocialBtnBox>
        <SocialBtn onClick={googleBtnClick}>
          <img src={google} />
        </SocialBtn>
        <SocialBtn onClick={kakaoBtnClick}>
          <img src={kakao} />
        </SocialBtn>
      </SocialBtnBox>
    </AuthContainer>
  );
}

export default Signin;
