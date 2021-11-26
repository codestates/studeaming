import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import styled from "styled-components";

const SideLogSection = styled.section`
  width: 332px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  padding: 40px;
  border-radius: 0 1rem 1rem 0;
  border: 1px solid;
  z-index: 3000;
`;

const UserBox = styled.div`
  display: flex;
  justify-content: space-between;

  > .logout {
    cursor: pointer;
  }
`;

const UserImg = styled.div`
  width: 50px;
  height: 50px;
  border: 1px solid;
  border-radius: 100%;
`;

const UserNameAndComment = styled.div`
  margin-top: 4px;
  width: 58%;

  > div {
    > .nickname {
      margin-right: 10px;
      font-weight: 700;
    }
    > .user_edit {
      font-size: 14px;
      color: #6e6e6e;
      cursor: pointer;
    }
  }

  > .comment {
    margin-top: 5px;
    font-size: 12px;
  }
`;

const TogleBox = styled.div``;

const TenMinuteLog = styled.div``;

function SideLog() {
  useEffect(() => {
    gsap.from("#side_log", { x: -414 });
  }, []);

  return (
    <SideLogSection id="side_log">
      <UserBox>
        <UserImg />
        <UserNameAndComment>
          <div>
            <span className="nickname">닉네임</span>
            <span className="user_edit">편집</span>
          </div>
          <div className="comment">코멘트</div>
        </UserNameAndComment>
        <span className="logout">로그아웃</span>
      </UserBox>
      <TogleBox>토글 박스</TogleBox>
      <TenMinuteLog>텐미닛 로그</TenMinuteLog>
    </SideLogSection>
  );
}

export default SideLog;
