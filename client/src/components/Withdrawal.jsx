import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { loginStateChange } from "../store/actions";
import authAPI from "../api/auth";
import Button from "./Button";
import SuccessNotify from "./SuccessNotify";
import { Title, Input } from "../styles/reusableStyle";

const Container = styled.div`
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .withdrawal_body {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .withdrawal_description {
    color: var(--color-black-50);
    font-size: 0.8rem;
    text-align: center;
    line-height: 1.2rem;
    margin-bottom: 1rem;
  }

  #warning_message {
    color: var(--color-destructive);
    font-size: 0.7rem;
    margin: 1rem 0;
  }
`;

function Withdrawal() {
  const { isSocialLogined, isGuestLogined } = useSelector(
    ({ userReducer }) => userReducer
  );
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [isReqFailed, setIsReqFailed] = useState(false);
  const input = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getPassword = (e) => {
    setPassword(e.target.value);
  };

  const withdrawalHandler = () => {
    if (isSocialLogined || isGuestLogined) {
      if (password === "잘있어요 스터디밍") {
        authAPI
          .withdraw()
          .then(() => {
            setIsSuccess(true);
            dispatch(loginStateChange(false));
            navigate("/home");
          })
          .catch(() => {});
      } else {
        setIsReqFailed(true);
        setMessage("메세지를 바르게 입력해주세요.");
        input.current.focus();
      }
    } else {
      authAPI
        .withdraw(password)
        .then(() => {
          setIsSuccess(true);
          dispatch(loginStateChange(false));
          navigate("/home");
        })
        .catch(() => {
          setIsReqFailed(true);
          setMessage("비밀번호가 일치하지 않습니다.");
          input.current.focus();
        });
    }
  };

  return (
    <Container>
      <Title>탈퇴하기</Title>
      {isSuccess ? (
        <SuccessNotify
          message="탈퇴가 완료되었습니다"
          description="이용해주셔서 감사합니다."
        />
      ) : (
        <div className="withdrawal_body">
          <div className="withdrawal_description">
            스터디밍 서비스를 더 이상 사용하지 않으신다면
            <br />
            {isSocialLogined || isGuestLogined ? "아래 메세지" : "비밀번호"}를
            입력한 후 탈퇴할 수 있습니다.
          </div>
          <Input
            type={isSocialLogined || isGuestLogined ? "text" : "password"}
            onChange={getPassword}
            ref={input}
            placeholder={
              isSocialLogined || isGuestLogined
                ? `'잘있어요 스터디밍'을 입력해주세요`
                : "비밀번호를 입력해주세요"
            }
            spellCheck="false"
          />
          <div id="warning_message">
            {isReqFailed
              ? message
              : "탈퇴 후에는 사용자 정보가 즉시 삭제되며 복구할 수 없습니다."}
          </div>
          <Button message="탈퇴 완료" clickEvent={withdrawalHandler} />{" "}
        </div>
      )}
    </Container>
  );
}

export default Withdrawal;
