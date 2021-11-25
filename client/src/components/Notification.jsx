import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { dequeueNotification } from "../store/actions/index";
import styled from "styled-components";

export const Notify = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 3rem;
  position: fixed;
  width: 400px;
  height: 50px;
  z-index: 999999;
  left: 50% - 200px;
  top: 55px;
  box-shadow: 0px 0px 10px rgba(141, 141, 141, 0.8);
  transition: transform 0.6s ease-in-out;
  animation: toast-in-right 0.6s;
  transition: 0.6s ease;

  @keyframes toast-in-right {
    from {
      transform: translateY(-10px);
    }
    to {
      transform: translateY(0px);
    }
  }

  > .message {
    padding: 4px 12px;
    border-radius: 1rem;
  }

  > .link {
    text-decoration: underline;
    cursor: pointer;
    font-weight: 600;
    color: #9c5230;
  }
  > .fade {
    opacity: 0;
    transform: opacity 1.5s;
  }
`;

function Notification({ message, link, time }) {
  const [isFading, setIsFading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navigateHandler = (event) => {
    if (event.target.textContent === "로그인 페이지로 가기") {
      dispatch(dequeueNotification());
      navigate("./login");
    } else if (event.target.textContent === "내 책장으로 가기") {
      dispatch(dequeueNotification());
      navigate("./mypage");
    }
  };

  useEffect(() => {
    let mounted = true;
    setTimeout(() => {
      if (mounted) {
        setIsFading(true);
      }
    }, time);

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Notify>
      <span className={`message ${isFading ? "fade" : ""}`}>{message}</span>
      <span
        className={`link ${isFading ? "fade" : ""}`}
        onClick={navigateHandler}
      >
        {link}
      </span>
    </Notify>
  );
}
export default Notification;
