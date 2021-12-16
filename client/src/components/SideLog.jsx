import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signinModalOpen,
  sideLogOpen,
  userInfoEditModalOpen,
  loginStateChange,
  getUserInfo,
  verifyGuestLogined,
} from "../store/actions/index";
import { gsap } from "gsap";
import styled from "styled-components";
import { IoIosArrowUp, IoIosArrowBack, IoIosAdd } from "react-icons/io";
import toggleAPI from "../api/studyToggle";
import logAPI from "../api/studyLog";
import authAPI from "../api/auth";
import ToggleBox from "./ToggleBox";
import LogChart from "./LogChart";
import Button from "./Button";
import defaultImg from "../assets/images/img_profile_default.svg";

const SideLogSection = styled.div`
  min-width: 332px;
  height: 690px;
  display: flex;
  flex-direction: column;
  padding: 35px;
  border-radius: 0 1rem 1rem 0;
  position: fixed;
  top: 20px;
  overflow: scroll;
  z-index: 3000;
  background-color: white;
  box-shadow: 0px 0px 15px #8d8d8d;

  ::-webkit-scrollbar {
    display: none;
  }

  @media screen and (max-width: 480px) {
    position: fixed;
    width: 100%;
    height: 400px;
    align-items: center;
    box-shadow: none;
    border-radius: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    padding: 25px;
  }
`;

const ContentsContainer = styled.div`
  width: fit-content;
  height: 75%;
  position: relative;

  @media screen and (max-width: 480px) {
    width: 80%;
    height: fit-content;
  }
`;

const UserBox = styled.div`
  display: flex;
  justify-content: start;
`;

const UserImg = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserNameAndLogout = styled.div`
  width: 100%;
  margin-left: 4px;

  > div {
    > .nickname {
      margin-right: 10px;
      margin-left: 5px;
      font-weight: 700;
      font-size: 14px;
    }
    > .user_edit {
      font-size: 12px;
      color: #6e6e6e;
      cursor: pointer;
      margin-right: 75px;
    }
    > .logout {
      margin-top: 4px;
      cursor: pointer;
      font-size: 12px;

      @media screen and (max-width: 360px) {
        margin-left: -20px;
      }
    }
  }

  > .about {
    margin-top: 5px;
    margin-left: 5px;
    font-size: 12px;
  }
`;

const ToggleBoxWrapper = styled.div`
  padding: 20px 0;
  display: grid;
  place-items: center;
  grid-template-rows: repeat(auto-fill, 1fr);
  grid-template-columns: repeat(3, 1fr);
  gap: 5px 5px;
`;

const ToggleAddBox = styled.div`
  width: 80px;
  height: 80px;
  border: 1px dashed;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ToggleEditBox = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 1rem;
  box-shadow: 0px 0px 4px var(--color-black-25);
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;

  > .edit_letter_box {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
`;

const EditClose = styled.div`
  font-size: 10px;
  cursor: pointer;
`;

const EditComplete = styled.div`
  font-size: 10px;
  cursor: pointer;
`;

const ColorSelectedBox = styled.input`
  width: 60px;
  height: 20px;
  background-color: ${(props) => `var(--color-${props.color})`};
  margin-top: 5px;
  border: none;
  outline: none;
  text-align: center;
  font-size: 10px;
  ::placeholder,
  ::-webkit-input-placeholder {
    color: #6e6e6e;
    font-size: 8px;
    letter-spacing: 1px;
    text-align: center;
  }
`;

const ColorPickBox = styled.div`
  margin-top: 10px;
  display: flex;
`;

const ColorPick = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background-color: ${(props) => `var(--color-${props.color})`};
  margin: 0 2px;
`;

const PlusIcon = styled(IoIosAdd)`
  font-size: 24px;

  :hover {
    cursor: pointer;
    font-size: 30px;
  }
`;

const SideLogCloseBackIcon = styled(IoIosArrowBack)`
  position: absolute;
  top: 60%;
  right: -30px;
  font-size: 24px;
  z-index: 100;

  :hover {
    cursor: pointer;
  }

  @media screen and (max-width: 480px) {
    display: none;
  }
`;

const SideLogCloseUpIcon = styled.div`
  display: none;

  @media screen and (max-width: 480px) {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const SideLogUpIcon = styled(IoIosArrowUp)`
  display: none;

  @media screen and (max-width: 480px) {
    display: flex;
    position: absolute;
    top: 5px;
    left: 1.5rem;
    z-index: 100;

    :hover {
      cursor: pointer;
    }
  }
`;

const LoginBlur = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-gray-bg-25);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;

  @media screen and (max-width: 480px) {
    height: 200%;
  }
`;

const WhatToDo = styled.div`
  width: 200px;
  padding: 1rem 0;
  text-align: center;
  font-weight: bold;
  color: var(--color-black-50);

  @media screen and (max-width: 480px) {
    position: absolute;
    top: 12%;
  }
`;

const ButtonContainer = styled.div`
  width: 180px;

  @media screen and (max-width: 480px) {
    position: absolute;
    top: 27%;
  }
`;

function SideLog() {
  const { isLogin, profileImg, username, about } = useSelector(
    ({ userReducer }) => userReducer
  );
  const [toggles, setToggles] = useState([
    { name: "휴식", isOn: 0, color: "yellow", id: null },
  ]);
  const [plusClick, setPlusClick] = useState(false);
  const [pickedColor, setPickedColor] = useState("gray-bg-100");
  const [inputValue, setInputValue] = useState("공부");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const colorPick = ["red", "orange", "green", "blue", "purple"];
  const date = new Date();
  const eightDigitDate = `${date.getFullYear()}${date.getMonth() + 1}${
    date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
  }`;
  const offset = date.getTimezoneOffset();

  const logoutHandler = () => {
    authAPI.signout().then(() => {
      dispatch(loginStateChange(false));
      dispatch(sideLogOpen(false));
      navigate("/home");
    });
  };

  const editCompleteHandler = () => {
    const newToggle = {
      name: inputValue,
      isOn: 0,
      color: pickedColor,
    };
    toggleAPI
      .makeToggle(newToggle.name, newToggle.color)
      .then((res) => {
        const { id } = res.data.newToggle;
        setToggles([...toggles, { ...newToggle, id }]);
        setPlusClick(false);
        setPickedColor("gray-bg-100");
        setInputValue("공부");
      })
      .catch(() => {
        dispatch(loginStateChange(false));
        dispatch(sideLogOpen(false));
        dispatch(signinModalOpen(true));
      });
  };

  const toggleHandler = (idx) => {
    const turnedOn = [...toggles].filter((toggle) => toggle.isOn === 1);

    if (turnedOn.length > 0) {
      const turnOffAll = [...toggles].map((toggle) => ({ ...toggle, isOn: 0 }));

      if (turnedOn[0].id === toggles[idx].id) {
        //토글 끄는 조건
        logAPI.finishLog(turnedOn[0].id);
        setToggles(turnOffAll);
      } else {
        //토글 하나 켜져있을 때 다른 토글 바로 켜는 조건
        const finishedToggle = turnedOn[0];
        logAPI.finishLog(finishedToggle.id);

        const clickedToggle = turnOffAll[idx];
        clickedToggle.isOn = 1;
        setToggles(turnOffAll);
        logAPI.initiateLog(clickedToggle.id);
      }
    } else {
      //아무것도 안켜져있을 때 켜는 조건
      const newToggles = [...toggles];
      const clicked = newToggles[idx];
      clicked.isOn = 1;
      setToggles(newToggles);
      logAPI.initiateLog(clicked.id);
    }
  };

  const userInfoEditHandler = () => {
    dispatch(userInfoEditModalOpen(true));
  };

  const sideLogCloseBackIconHandler = () => {
    gsap.to("#side_log", { x: -400, duration: 1 });
    setTimeout(() => {
      dispatch(sideLogOpen(false));
    }, 1000);
  };

  const sideLogCloseUpIconHandler = () => {
    gsap.to("#side_log", { y: -450, duration: 1 });
    setTimeout(() => {
      dispatch(sideLogOpen(false));
    }, 1000);
  };

  const guestSigninHandler = () => {
    authAPI
      .guestSignin()
      .then((res) => {
        const data = res.data.user;
        dispatch(loginStateChange(true));
        dispatch(verifyGuestLogined(true));
        dispatch(getUserInfo(data));
        toggleAPI
          .getToggles()
          .then((res) => {
            setToggles(res.data.toggleList);
          })
          .catch((e) => {
            dispatch(loginStateChange(false));
            dispatch(sideLogOpen(false));
            dispatch(signinModalOpen(true));
          });
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (isLogin) {
      toggleAPI
        .getToggles()
        .then((res) => {
          setToggles(res.data.toggleList);
        })
        .catch((e) => {
          dispatch(loginStateChange(false));
          dispatch(sideLogOpen(false));
          dispatch(signinModalOpen(true));
        });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <SideLogSection id="side_log">
      {isLogin ? null : (
        <LoginBlur>
          <WhatToDo>
            <span>
              게스트 로그인시 1시간 동안
              <br />
              스트리밍을 제외한
              <br />
              모든 서비스 이용이 가능합니다.
            </span>
          </WhatToDo>
          <ButtonContainer>
            <Button
              message="게스트 로그인하기"
              clickEvent={guestSigninHandler}
            />
          </ButtonContainer>
        </LoginBlur>
      )}
      <SideLogUpIcon onClick={sideLogCloseUpIconHandler} />
      <ContentsContainer>
        <UserBox>
          <UserImg>
            <img src={profileImg || defaultImg} alt="profile" />
          </UserImg>
          <UserNameAndLogout>
            <div>
              <span className="nickname">{username || "김코딩"} 님</span>
              {isLogin ? (
                <>
                  <span className="user_edit" onClick={userInfoEditHandler}>
                    편집
                  </span>
                  <span className="logout" onClick={logoutHandler}>
                    로그아웃
                  </span>
                </>
              ) : null}
            </div>
            {isLogin ? (
              <div className="about">{about || "본인을 소개해보세요."}</div>
            ) : (
              <div className="about">로그인 후 이용가능 합니다.</div>
            )}
          </UserNameAndLogout>
        </UserBox>
        <ToggleBoxWrapper>
          {toggles.map((toggle, idx) => (
            <ToggleBox
              key={idx}
              name={toggle.name}
              color={toggle.color}
              isOn={toggle.isOn}
              idx={idx}
              toggles={toggles}
              setToggles={setToggles}
              toggleHandler={toggleHandler}
            />
          ))}
          {toggles.length < 6 ? (
            plusClick ? (
              <ToggleEditBox>
                <div className="edit_letter_box">
                  <EditClose
                    onClick={() => {
                      setPlusClick(false);
                    }}
                  >
                    취소
                  </EditClose>
                  <EditComplete onClick={editCompleteHandler}>
                    완료
                  </EditComplete>
                </div>
                <ColorSelectedBox
                  color={pickedColor}
                  placeholder="과목 입력"
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                  maxLength="9"
                  spellCheck="false"
                />
                <ColorPickBox>
                  {colorPick.map((color, idx) => (
                    <ColorPick
                      key={idx}
                      color={color}
                      onClick={() => {
                        setPickedColor(color);
                      }}
                    />
                  ))}
                </ColorPickBox>
              </ToggleEditBox>
            ) : (
              <ToggleAddBox>
                <PlusIcon
                  onClick={() => {
                    setPlusClick(true);
                  }}
                />
              </ToggleAddBox>
            )
          ) : null}
        </ToggleBoxWrapper>
        <div style={{ height: "100%" }}>
          <LogChart date={eightDigitDate} offset={offset} />
        </div>
        <SideLogCloseBackIcon onClick={sideLogCloseBackIconHandler} />
        <SideLogCloseUpIcon>
          <IoIosArrowUp
            size="24"
            style={{ cursor: "pointer" }}
            onClick={sideLogCloseUpIconHandler}
          />
        </SideLogCloseUpIcon>
      </ContentsContainer>
    </SideLogSection>
  );
}

export default SideLog;
