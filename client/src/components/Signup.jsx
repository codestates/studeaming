import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import authAPI from "../api/auth";
import {
  AuthContainer,
  Title,
  InputContainer,
  Desc,
  Input,
  ErrorMsg,
  FailureMsg,
} from "../styles/reusableStyle";
import SuccessNotify from "./SuccessNotify";
import Button from "./Button";

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImg = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 14px;
  :hover {
    color: #f5f5f5;
  }
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 14px;
    object-fit: cover;
  }
  #remove_profile_img {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
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
  margin-bottom: 14px;

  + input {
    display: none;
  }
`;

const Terms = styled.span`
  align-self: flex-start;
  font-size: 0.8rem;
  margin-bottom: 12px;
  cursor: pointer;

  :hover {
    font-weight: 600;
  }
`;

const ButtonContainer = styled.div`
  width: 220px;
`;

const TermsContainer = styled.div`
  padding: 0 4px;
  display: ${(props) => (props.isTermsOpen ? "block" : "none")};
  width: 300px;

  .terms-body {
    display: inline-block;
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
  }
  .terms-head {
    display: block;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-black-50);
    margin-bottom: 0em;
  }

  #terms-notification {
    font-size: 0.8rem;
    color: var(--color-black-50);
    margin: 0.2rem 0 1rem;
  }
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
    failure: "",
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [isReqFailed, setIsReqFailed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const formData = useRef(null);
  const regExpEmail =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  const regExpPwd = /^(?=.*?[a-z])(?=.*?[0-9]).{8,16}$/i;

  const getProfileImg = (event) => {
    const src = event.target.files[0];
    setSignupInfo({ ...signupInfo, image: src });
    setImageUrl(URL.createObjectURL(src));
  };

  const removeProfileImg = () => {
    setSignupInfo({ ...signupInfo, image: null });
    setImageUrl(null);
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
          setMessage({
            ...message,
            email: "위 이메일로 인증 메일이 전송됩니다.",
          });
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

  const openTerms = () => {
    setIsTermsOpen(true);
  };

  const closeTerms = () => {
    setIsTermsOpen(false);
  };

  const signupHandler = () => {
    const { email, username, password, check } = isValid;
    if (email && username && password && check) {
      formData.current = new FormData();
      formData.current.append("profile_img", signupInfo.image);
      formData.current.append("email", signupInfo.email);
      formData.current.append("username", signupInfo.username);
      formData.current.append("password", signupInfo.password);
      authAPI
        .signup(formData.current)
        .then(() => {
          setIsSuccess(true);
        })
        .catch(() => {
          setIsReqFailed(true);
          setMessage({ ...message, failure: "새로고침 후 다시 시도해주세요." });
        });
    } else {
      setIsReqFailed(true);
      setMessage({ ...message, failure: "입력란을 다시 확인해주세요." });
    }
  };

  useEffect(() => {
    checkMatched();
    // eslint-disable-next-line
  }, [signupInfo.password, signupInfo.check]);

  return (
    <>
      <AuthContainer isTermsOpen={isTermsOpen}>
        <Title>회원가입</Title>
        {isSuccess ? (
          <SuccessNotify
            message={`${signupInfo.username}님 환영합니다!`}
            description="이메일 인증 후 로그인해주세요."
          />
        ) : (
          <InputSection>
            {imageUrl ? (
              <ProfileImg onClick={removeProfileImg}>
                <img src={imageUrl} alt="profile" />
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
              <ErrorMsg isNoti={message.email.includes("인증")}>
                {message.email}
              </ErrorMsg>
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
            <Terms onClick={openTerms}>👉 개인정보 수집 및 이용내역</Terms>
            {isReqFailed && <FailureMsg>{message.failure}</FailureMsg>}
            <ButtonContainer>
              <Button message="동의 및 회원가입" clickEvent={signupHandler} />
            </ButtonContainer>
          </InputSection>
        )}
      </AuthContainer>
      <TermsContainer isTermsOpen={isTermsOpen}>
        <Title>개인정보 수집 및 이용내역</Title>
        <h3 className="terms-head">수집 내역</h3>
        <span className="terms-body">
          이메일, 비밀번호, 가입인증 정보, 카메라 송출 내역 및 캡쳐본
        </span>
        <h3 className="terms-head">수집 목적</h3>
        <span className="terms-body">
          본인 여부 확인 및 부적절한 영상 송출에 대한 신고로 제출된 영상 캡쳐본
          검수를 통한 이용 권한 제재 판단
        </span>
        <h3 className="terms-head">보유 및 이용 기간</h3>
        <span className="terms-body">회원가입 철회 시 까지</span>
        <div id="terms-notification">
          위 사항은 스터디밍 회원가입 및 서비스 제공에 필요한 필수 정보 수집에
          관한 내용입니다. 수집 내역은 임의로 사용되지 않으며 수집 목적에
          따라서만 이용됩니다. <br />
          해당 정보 수집 및 이용을 거부하실 수 있으며, 동의를 거부하실 경우
          회원가입 및 회원 서비스 이용이 불가능합니다.
        </div>
        <Button
          message="회원가입으로 돌아가기"
          clickEvent={closeTerms}
        ></Button>
      </TermsContainer>
    </>
  );
}

export default Signup;
