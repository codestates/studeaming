import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BsCheckCircle } from "react-icons/bs";
import crypto from "crypto-js";
import authAPI from "../api/auth";
import Button from "./Button";
import { Title, Input } from "./reusableStyle";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .withdrawal_description {
    color: var(--color-black-50);
    font-size: 0.8rem;
    text-align: center;
    line-height: 1.2rem;
    margin-bottom: 1rem;
  }

  #withdrawal_success_container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #withdrawal_success {
    margin: 0.8rem 0;
  }

  #warning_message {
    color: var(--color-destructive);
    font-size: 0.7rem;
    margin: 1rem 0;
  }
`;

const StyledCheck = styled(BsCheckCircle)`
  color: var(--color-main-100);
  margin-bottom: 5px;
`;

function Withdrawal() {
  const { isSocialLogined } = useSelector(({ userReducer }) => userReducer);
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const getPassword = (e) => {
    setPassword(e.target.value);
  };

  const withdrawalHandler = () => {
    const encryptedPwd = crypto.AES.encrypt(
      password,
      process.env.REACT_APP_SECRET_KEY
    ).toString();

    authAPI
      .withdraw(encryptedPwd)
      .then(() => {
        setIsSuccess(true);
        navigate("/main");
      })
      .catch(() => {});
  };

  return (
    <Container>
      <Title>탈퇴하기</Title>
      {isSuccess ? (
        <div id="withdrawal_success_container">
          <StyledCheck size="30px" />
          <div id="withdrawal_success">탈퇴가 완료되었습니다.</div>
          <div className="withdrawal_description">
            스터디밍은 언제나 당신의 배움을 응원하겠습니다.
            <br />
            이용해주셔서 감사합니다.
          </div>
        </div>
      ) : (
        <div>
          <div className="withdrawal_description">
            스터디밍 서비스를 더 이상 사용하지 않으신다면
            <br />
            {isSocialLogined ? "아래 메세지" : "비밀번호"}를 입력한 후 탈퇴할 수
            있습니다.
          </div>
          <Input
            type="password"
            onChange={getPassword}
            placeholder={
              isSocialLogined
                ? `'잘있어요 스터디밍'을 입력해주세요`
                : "비밀번호를 입력해주세요"
            }
          />
          <div id="warning_message">
            탈퇴 후에는 사용자 정보가 즉시 삭제되며 복구할 수 없습니다.
          </div>
          <Button message="탈퇴 완료" clickEvent={withdrawalHandler} />{" "}
        </div>
      )}
    </Container>
  );
}

export default Withdrawal;
