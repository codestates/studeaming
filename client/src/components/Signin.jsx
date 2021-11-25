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
import { Input } from "./reusableStyle";
import authAPI from "../api/auth";
import google from "../assets/images/btn_google.svg";
import kakao from "../assets/images/btn_kakao.svg";

const SigninLogo = styled.span`
  padding: 50px 130px;
  font-size: 14px;
  color: #6e6e6e;
`;

const InputBox = styled.div`
  position: relative;
`;

const Icon = styled(FontAwesomeIcon)`
  position: absolute;
  right: 65px;
  top: 10px;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  margin: 30px;
`;

const Button = styled.div`
  width: 120px;
  height: 35px;
  cursor: pointer;
  border: 1px solid;
  border-radius: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
`;

const SignupBtn = styled.span`
  font-size: 14px;
  cursor: pointer;
`;

const SocialBtnBox = styled.div`
  margin: 50px;
`;

const SocialBtn = styled.img`
  width: 50px;
  height: 50px;
  cursor: pointer;
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
    <>
      <SigninLogo>로그인</SigninLogo>
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
            if (e.key === "Enter") loginHandler();
          }}
        />
        <Icon icon={faLock} />
      </InputBox>
      <ButtonBox>
        <Button onClick={loginHandler}>로그인</Button>
        <SignupBtn onClick={openSignup}>회원가입</SignupBtn>
      </ButtonBox>
      <SocialBtnBox>
        <SocialBtn src={google} />
        <SocialBtn src={kakao} />
      </SocialBtnBox>
    </>
  );
}

export default Signin;
