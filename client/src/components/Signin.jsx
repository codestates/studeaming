import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  verifyGuestLogined,
  getUserInfo,
  loginStateChange,
  signinModalOpen,
  signupModalOpen,
  modalOff,
  getFollows,
} from "../store/actions/index";
import styled from "styled-components";
import { notification } from "antd";
import "antd/dist/antd.css";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";
import {
  AuthContainer,
  Title,
  Input,
  FailureMsg,
} from "../styles/reusableStyle";
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

const AssistBtn = styled.div`
  display: inline-block;
  margin: 15px 10px;
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

const ButtonContainer = styled.button`
  width: 220px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function Signin() {
  const [signinInfo, setSigninInfo] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isReqFailed, setIsReqFailed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const regExpEmail =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  const redirect = window.location.href.split("/").slice(-1)[0];

  const handleInputValue = (key) => (e) => {
    setSigninInfo({ ...signinInfo, [key]: e.target.value });
  };

  const signinHandler = (e) => {
    e.preventDefault();
    if (!signinInfo.email.length) {
      setIsReqFailed(true);
      setMessage("???????????? ??????????????????.");
    } else if (!signinInfo.password.length) {
      setIsReqFailed(true);
      setMessage("??????????????? ??????????????????.");
    } else if (!regExpEmail.test(signinInfo.email)) {
      setIsReqFailed(true);
      setMessage("????????? ????????? ????????? ????????????.");
    } else {
      authAPI
        .signin(signinInfo.email, signinInfo.password)
        .then(() => {
          dispatch(loginStateChange(true));
          dispatch(modalOff());
          return userAPI.getUserInfo();
        })
        .then((res) => {
          const { id, username, profileImg, about, studeaming } = res.data.user;
          const data = { id, username, profileImg, about, studeaming };
          dispatch(getUserInfo(data));
          return userAPI.getFollows();
        })
        .then((res) => {
          dispatch(getFollows(res.data.studeamerList));
          if (redirect === "viewer" || "asmrsound")
            dispatch(signinModalOpen(false));
          else navigate("/home");
        })
        .catch((err) => {
          if (err.response.status === 401) {
            if (err.response.data.message === "Verify email address") {
              setIsReqFailed(true);
              setMessage("????????? ????????? ??????????????????.");
            } else {
              setIsReqFailed(true);
              setMessage("???????????? ??????????????? ?????? ??????????????????.");
            }
          } else {
            setIsReqFailed(true);
            setMessage("???????????? ??? ?????? ??????????????????.");
          }
        });
    }
  };

  const guestSigninHandler = () => {
    authAPI
      .guestSignin()
      .then((res) => {
        const data = res.data.user;
        dispatch(loginStateChange(true));
        dispatch(verifyGuestLogined(true));
        dispatch(getUserInfo(data));
        dispatch(modalOff());
        notification.open({
          message: (
            <div style={{ fontSize: "1rem" }}>???????????? ????????????????????????</div>
          ),
          description: (
            <div style={{ fontSize: "0.8rem" }}>
              ????????? ???????????? 1?????? ??? ???????????? ??????????????? ???????????????. <br />
              ????????? ?????????????????? ????????????????????????!
            </div>
          ),
        });
      })
      .catch(() => {
        setMessage("???????????? ??? ?????? ??????????????????.");
      });
  };

  const openSignupHandler = () => {
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
    <AuthContainer onSubmit={signinHandler}>
      <Title>?????????</Title>
      <InputBox>
        <Input
          type="email"
          name="email"
          placeholder="?????????"
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
          name="password"
          placeholder="????????????"
          onChange={handleInputValue("password")}
          onKeyUp={(e) => {
            e.key === "Enter" && signinHandler();
          }}
        />
        <Icon icon={faLock} />
      </InputBox>
      <ButtonContainer type="submit">
        {isReqFailed && <FailureMsg>{message}</FailureMsg>}
        <Button message="?????????" />
      </ButtonContainer>
      <div>
        <AssistBtn onClick={guestSigninHandler}>????????? ?????????</AssistBtn>
        <AssistBtn onClick={openSignupHandler}>????????????</AssistBtn>
      </div>
      <SocialBtnBox>
        <SocialBtn onClick={googleBtnClick}>
          <img src={google} alt="google-oauth-login" />
        </SocialBtn>
        <SocialBtn onClick={kakaoBtnClick}>
          <img src={kakao} alt="kakao-oauth-login" />
        </SocialBtn>
      </SocialBtnBox>
    </AuthContainer>
  );
}

export default Signin;
