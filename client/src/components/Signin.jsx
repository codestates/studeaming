import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  notify,
  loginStateChange,
  signinModalOpen,
  signupModalOpen,
} from "../store/actions/index";
import styled from "styled-components";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";
import { AuthContainer, Title, Input } from "./reusableStyle";
import authAPI from "../api/auth";
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
  margin: 10px 0px 5px 0px;
`;

const SocialBtn = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  width: 220px;
  margin-top: 40px;
`;

function Signin() {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const regExpEmail =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

  const handleInputValue = (key) => (e) => {
    setLoginInfo({ ...loginInfo, [key]: e.target.value });
  };

  const loginHandler = () => {
    if (!loginInfo.email.length) {
      dispatch(notify("이메일을 입력해주세요."));
    } else if (!loginInfo.password.length) {
      dispatch(notify("비밀번호를 입력해주세요."));
    } else if (!regExpEmail.test(loginInfo.email)) {
      dispatch(notify("올바른 이메일 형식이 아닙니다."));
    } else {
      authAPI
        .signin(loginInfo.email, loginInfo.password)
        .then(() => {
          dispatch(loginStateChange(true));
          navigate("/");
        })
        .catch((err) => {
          if (err.response.status === 401) {
            dispatch(notify("잘못된 아이디 이거나 비밀번호가 틀렸습니다."));
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

  return (
    <AuthContainer>
      <Title>로그인</Title>
      <InputBox>
        <Input
          type="text"
          placeholder="이메일"
          onChange={handleInputValue("email")}
          onKeyUp={(e) => {
            if (e.key === "Enter") loginHandler();
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
            e.key === "Enter" && loginHandler();
          }}
        />
        <Icon icon={faLock} />
      </InputBox>
      <ButtonContainer>
        <Button message="로그인" clickEvent={loginHandler}></Button>
      </ButtonContainer>
      <SignupBtn onClick={openSignup}>회원가입</SignupBtn>
      <SocialBtnBox>
        <SocialBtn src={google} />
        <SocialBtn src={kakao} />
      </SocialBtnBox>
    </AuthContainer>
  );
}

export default Signin;
