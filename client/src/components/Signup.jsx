import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import crypto from "crypto-js";
import authAPI from "../api/auth";
import { modalOff, notify } from "../store/actions";
import Button from "./Button";
import {
  AuthContainer,
  Title,
  InputContainer,
  Desc,
  Input,
  ErrorMsg,
} from "./reusableStyle";

const ProfileImg = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 16px;
  :hover {
    color: #f5f5f5;
  }
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 16px;
    object-fit: cover;
  }
  #remove_profile_img {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    /* top: 50%; */
    top: 0;
    left: 0;
    color: transparent;
    border-radius: 50%;
    font-size: 24px;
    :hover {
      transition: 0.3s;
      background-color: rgba(0, 0, 0, 0.3);
      color: #f5f5f5;
    }
  }
`;

const ImgLabel = styled.label`
  width: 100px;
  height: 100px;
  border: 1px dashed grey;
  border-radius: 50%;
  font-size: 12px;
  color: #8d8d8d;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 16px;
  + input {
    display: none;
  }
`;

const ButtonContainer = styled.div`
  width: 220px;
`;

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    image: null,
    email: "",
    username: "",
    password: "",
    check: "",
  });
  const [isValid, setIsValid] = useState({
    email: false,
    username: "",
    password: false,
    check: false,
  });
  const [message, setMessage] = useState({
    email: "",
    username: "",
    password: "",
    check: "",
  });
  const dispatch = useDispatch();
  const regExpEmail =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  const regExpPwd = /^(?=.*?[a-z])(?=.*?[0-9]).{8,16}$/i;

  const getProfileImg = (event) => {
    const src = event.target.files[0];
    setSignupInfo({ ...signupInfo, image: URL.createObjectURL(src) });
  };

  const removeProfileImg = () => {
    setSignupInfo({ ...signupInfo, image: null });
  };

  const handleInputValue = (key) => (e) => {
    setSignupInfo({ ...signupInfo, [key]: e.target.value });
    if (!signupInfo[key].length) {
      setMessage({ ...message, [key]: "" });
      setIsValid({ ...isValid, [key]: false });
    }
  };

  const checkEmail = () => {
    if (!regExpEmail.test(signupInfo.email) && signupInfo.email.length) {
      setMessage({ ...message, email: "올바른 이메일 형식이 아닙니다." });
      setIsValid({ ...isValid, email: false });
    } else if (regExpEmail.test(signupInfo.email)) {
      authAPI
        .checkAvailability("email", signupInfo.email)
        .then(() => {
          setMessage({ ...message, email: "" });
          setIsValid({ ...isValid, email: true });
        })
        .catch(() => {
          setMessage({ ...message, email: "중복된 이메일 입니다." });
          setIsValid({ ...isValid, email: false });
        });
    }
  };

  const checkPassword = () => {
    if (!regExpPwd.test(signupInfo.password) && signupInfo.password.length) {
      setMessage({
        ...message,
        password: "8~16자 영문 대 소문자, 숫자를 사용하세요.",
      });
      setIsValid({ ...isValid, password: false });
    } else {
      setMessage({ ...message, password: "" });
      setIsValid({ ...isValid, password: true });
    }
  };

  const checkMatched = () => {
    const { password, check } = signupInfo;
    if (
      (password === check && password.length) ||
      !(password.length && check.length)
    ) {
      setMessage({ ...message, check: "" });
      setIsValid({ ...isValid, check: true });
    } else {
      setMessage({
        ...message,
        check: "비밀번호가 일치하지 않습니다.",
      });
      setIsValid({ ...isValid, check: false });
    }
  };

  const checkUsername = () => {
    authAPI
      .checkAvailability("username", signupInfo.username)
      .then(() => {
        setMessage({ ...message, username: "" });
        setIsValid({ ...isValid, username: true });
      })
      .catch(() => {
        setMessage({ ...message, username: "중복된 닉네임 입니다." });
        setIsValid({ ...isValid, username: false });
      });
  };

  const signupHandler = () => {
    const { email, username, password, check } = isValid;
    if (email && username && password && check) {
      const encryptedPwd = crypto.AES.encrypt(
        signupInfo.password,
        process.env.REACT_APP_SECRET_KEY
      ).toString();
      authAPI
        .signup(
          signupInfo.image,
          signupInfo.username,
          signupInfo.email,
          encryptedPwd
        )
        .then(() => {
          dispatch(notify("회원가입이 완료되었습니다."));
          dispatch(modalOff());
        })
        .catch(() => {
          dispatch(notify("새로고침 후 다시 시도해주세요."));
        });
    } else {
      dispatch(notify("입력란을 다시 확인해주세요."));
    }
  };

  useEffect(() => {
    checkMatched();
    // eslint-disable-next-line
  }, [signupInfo.password, signupInfo.check]);

  return (
    <AuthContainer>
      <Title>회원가입</Title>
      {signupInfo.image ? (
        <ProfileImg onClick={removeProfileImg}>
          <img src={signupInfo.image} />
          <div id="remove_profile_img">&times;</div>
        </ProfileImg>
      ) : (
        <div>
          <ImgLabel htmlFor="profile_img">프로필 업로드</ImgLabel>
          <input
            type="file"
            id="profile_img"
            accept="image/*"
            onChange={getProfileImg}
          ></input>
        </div>
      )}
      <InputContainer>
        <Desc htmlFor="email">이메일</Desc>
        <Input
          type="email"
          id="email"
          onChange={handleInputValue("email")}
          onBlur={checkEmail}
        ></Input>
        <ErrorMsg>{message.email}</ErrorMsg>
      </InputContainer>
      <InputContainer>
        <Desc htmlFor="username">닉네임</Desc>
        <Input
          id="username"
          onChange={handleInputValue("username")}
          onBlur={checkUsername}
        ></Input>
        <ErrorMsg>{message.username}</ErrorMsg>
      </InputContainer>
      <InputContainer>
        <Desc htmlFor="password">비밀번호</Desc>
        <Input
          type="password"
          id="password"
          onChange={handleInputValue("password")}
          onBlur={checkPassword}
        ></Input>
        <ErrorMsg>{message.password}</ErrorMsg>
      </InputContainer>
      <InputContainer>
        <Desc htmlFor="check_password">비밀번호 확인</Desc>
        <Input
          type="password"
          id="check_password"
          onChange={handleInputValue("check")}
          onKeyUp={(e) => {
            e.key === "Enter" && signupHandler();
          }}
        ></Input>
        <ErrorMsg>{message.check}</ErrorMsg>
      </InputContainer>
      <ButtonContainer>
        <Button message="회원가입" clickEvent={signupHandler} />
      </ButtonContainer>
    </AuthContainer>
  );
}

export default Signup;
