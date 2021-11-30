import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import authAPI from "../api/auth";
import Button from "./Button";
import { Title, Input } from "./reusableStyle";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  #withdrawal_description {
    font-size: 0.8rem;
    text-align: center;
    margin-bottom: 1rem;
  }
  #warning_message {
    color: var(--color-destructive);
    font-size: 0.7rem;
    margin: 1rem 0;
  }
`;

function Withdrawal() {
  const { isSocialLogined } = useSelector(({ userReducer }) => userReducer);
  const [isSuccess, setIsSuccess] = useState(false);

  const withdrawalHandler = () => {
    // 탈퇴에 성공하면 isSuccess 상태 true 및 main페이지로 이동
    // true일때 탈퇴 완료 모달로 변경
    // 완료 확인 버튼 누르면 modalOff()
  };

  return (
    <Container>
      <Title>탈퇴하기</Title>
      <div id="withdrawal_description">
        스터디밍 서비스를 더 이상 사용하지 않으신다면
        <br />
        {isSocialLogined ? "아래 메세지" : "비밀번호"}를 입력한 후 탈퇴할 수
        있습니다.
      </div>
      <Input
        type="password"
        placeholder={
          isSocialLogined
            ? `'잘있어요 스터디밍'을 입력해주세요`
            : "비밀번호를 입력해주세요"
        }
      />
      <div id="warning_message">
        탈퇴 후에는 사용자 정보가 즉시 삭제되며 복구할 수 없습니다.
      </div>
      <Button message="탈퇴 완료" clickEvent={withdrawalHandler} />
    </Container>
  );
}

export default Withdrawal;
