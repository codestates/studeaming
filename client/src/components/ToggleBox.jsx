import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout, sideLogOpen, signinModalOpen } from "../store/actions/index";
import styled from "styled-components";
import { gsap } from "gsap";
import toggleAPI from "../api/studyToggle";
import logAPI from "../api/studyLog";

const ToggleSection = styled.section`
  width: 80px;
  height: 80px;
  background-color: #f8f8f8;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  > .delete {
    position: absolute;
    font-size: 10px;
    top: 5px;
    right: 5px;
    cursor: pointer;
  }
`;

const Name = styled.div`
  font-size: 10px;
  color: #6e6e6e;
`;

const ToggleBackground = styled.div`
  width: 40px;
  height: 20px;
  border-radius: 1rem;
  position: relative;
  margin: 4px;
  display: flex;
  align-items: center;
  background-position: ${(props) => (props.isOn ? "left" : "right")};
  background: ${(props) =>
    props.isOn
      ? `linear-gradient(to right, ${props.color} 50%, lightgrey 50%) left`
      : `linear-gradient(to left, lightgrey 50%, ${props.color} 50%) right`};
  background-size: 200%;
  transition: 0.5s;
`;

const Circle = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 1rem;
  background-color: white;
  position: absolute;
  top: 2px;
  left: 2px;
  cursor: pointer;
`;

function ToggleBox({
  name,
  color,
  isOn,
  idx,
  toggleHandler,
  toggles,
  setToggles,
}) {
  const dispatch = useDispatch();

  const deleteHandler = () => {
    if (toggles[idx].isOn === 1) {
      logAPI.finishLog(toggles[idx].id);
    }
    const filter = [...toggles.slice(0, idx), ...toggles.slice(idx + 1)];
    setToggles(filter);
    toggleAPI.deleteToggle(toggles[idx].id).catch(() => {
      dispatch(logout());
      dispatch(sideLogOpen(false));
      dispatch(signinModalOpen(true));
    });
  };

  useEffect(() => {
    if (isOn) {
      gsap.to(`.circle_${idx}`, { x: 20 });
    } else {
      gsap.to(`.circle_${idx}`, { x: 0 });
    }
  }, [isOn]);

  return (
    <ToggleSection>
      {name !== "휴식" ? (
        <div className="delete" onClick={deleteHandler}>
          삭제
        </div>
      ) : null}
      <Name>{name}</Name>
      <ToggleBackground color={color} isOn={isOn}>
        <Circle
          className={`circle_${idx}`}
          onClick={() => toggleHandler(idx)}
        />
      </ToggleBackground>
    </ToggleSection>
  );
}

export default ToggleBox;
