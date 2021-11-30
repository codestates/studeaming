import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  notify,
  logout,
  sideLogOpen,
  userInfoEditModalOpen,
} from "../store/actions/index";
import { gsap } from "gsap";
import styled from "styled-components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toggleApi from "../api/studyToggle";
import ToggleBox from "./ToggleBox";
import LogChart from "./LogChart";
import defaultImg from "../assets/images/img_profile_default.svg";

const SideLogSection = styled.section`
  width: 332px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  padding: 40px;
  border-radius: 0 1rem 1rem 0;
  position: fixed;
  top: 65px;
  z-index: 3000;
  background-color: white;
  box-shadow: 0px 0px 15px #8d8d8d;
`;

const UserBox = styled.div`
  display: flex;
  justify-content: start;
`;

const UserImg = styled.image`
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
  margin-top: 4px;
  width: 100%;

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
    }
  }

  > .comment {
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
  border: 1px solid;
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
  background-color: ${(props) => props.color};
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
  background-color: ${(props) => props.color};
  margin: 0 2px;
`;

const PlusIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
`;

function SideLog() {
  const { profileImg, username, about } = useSelector(
    ({ userReducer }) => userReducer
  );
  const [toggleBox, setToggleBox] = useState([
    { name: "휴식", isOn: false, color: "#a5c7e5", id: 0 },
  ]);
  const [plusClick, setPlusClick] = useState(false);
  const [pickedColor, setPickedColor] = useState("lightgrey");
  const [inputValue, setInputValue] = useState("공부");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const colorPick = ["#ffaeae", "#fdd4ae", "#b4e29e", "#565781", "#b094f2"];

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(sideLogOpen(false));
    navigate("/");
    dispatch(notify("로그아웃 되었습니다."));
  };

  const editCompleteHandler = () => {
    const num = toggleBox[toggleBox.length - 1].id + 1; //get 요청 받아오면 없애야할 부분
    const newToggle = {
      name: inputValue,
      isOn: false,
      color: pickedColor,
      id: num, //get 요청 받아오면 없애야할 부분
    };
    setToggleBox([...toggleBox, newToggle]);
    setPlusClick(false);
    setPickedColor("lightgrey");
    setInputValue("공부");
    // toggleApi
    //   .makeToggle(newToggle.name, newToggle.color, newToggle.isOn)
    //   .then((res) => {
    //     const { id } = res.data.newToggle;
    //     setToggleBox([...toggleBox, { ...newToggle, id }]);
    //     setPlusClick(false);
    //     setPickedColor("lightgrey");
    //     setInputValue("공부");
    //   });
  };

  const toggleHandler = (idx) => {
    const numOfIsOn = toggleBox.filter((el) => el.isOn === true);

    if (numOfIsOn.length > 0) {
      const allOff = toggleBox.map((el) => ({ ...el, isOn: false }));
      if (numOfIsOn[0].id === toggleBox[idx].id) {
        setToggleBox(allOff);
      } else {
        allOff[idx].isOn = !allOff[idx].isOn;
        setToggleBox(allOff);
      }
    } else {
      const newToggleBox = [...toggleBox];
      newToggleBox[idx].isOn = !newToggleBox[idx].isOn;
      setToggleBox(newToggleBox);
    }
  };

  const userInfoEditHandler = () => {
    dispatch(userInfoEditModalOpen(true));
  };

  useEffect(() => {
    toggleApi.getToggles().then((res) => {
      setToggleBox(res.data.toggleList);
    });
  }, [toggleBox]);

  useEffect(() => {
    gsap.from("#side_log", { x: -414 });
  }, []);

  return (
    <SideLogSection id="side_log">
      <UserBox>
        <UserImg>
          <img src={profileImg || defaultImg} />
        </UserImg>
        <UserNameAndLogout>
          <div>
            <span className="nickname">{username || "김코딩"}</span>
            <span className="user_edit" onClick={userInfoEditHandler}>
              편집
            </span>
            <span className="logout" onClick={logoutHandler}>
              로그아웃
            </span>
          </div>
          <div className="comment">{about || "본인을 소개해보세요."}</div>
        </UserNameAndLogout>
      </UserBox>
      <ToggleBoxWrapper>
        {toggleBox.map((toggle, idx) => (
          <ToggleBox
            key={idx}
            name={toggle.name}
            color={toggle.color}
            isOn={toggle.isOn}
            idx={idx}
            id={toggle.id}
            toggleBox={toggleBox}
            setToggleBox={setToggleBox}
            toggleHandler={toggleHandler}
          />
        ))}
        {toggleBox.length < 6 ? (
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
                <EditComplete onClick={editCompleteHandler}>완료</EditComplete>
              </div>
              <ColorSelectedBox
                color={pickedColor}
                placeholder="과목 입력"
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
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
                icon={faPlus}
                onClick={() => {
                  setPlusClick(true);
                }}
              />
            </ToggleAddBox>
          )
        ) : null}
      </ToggleBoxWrapper>
      <LogChart />
    </SideLogSection>
  );
}

export default SideLog;
