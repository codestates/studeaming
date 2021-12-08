import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Button from "./Button";

const StyledReport = styled.section`
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;

  > div {
    display: flex;
  }

  > span {
    font-size: 10px;
    margin-bottom: 5px;
    color: red;
  }

  > select {
    margin-bottom: 10px;
  }

  > textarea {
    border: 1px solid;
    width: 100%;
    margin-bottom: 10px;
  }
`;

function Report() {
  const { isReportOpen } = useSelector(({ modalReducer }) => modalReducer);
  const [report, setReport] = useState("");
  const [reportOpt, setReportOpt] = useState("");
  const opt = [
    "도박",
    "음란",
    "청소년 유해",
    "저작권 침해",
    "위법행위",
    "기타",
  ];

  const reportRequestHandler = () => {};

  return (
    <StyledReport>
      <h2>신고 하시겠습니까?</h2>
      <span>신고 대상 : {isReportOpen.username}</span>
      <select
        onChange={(e) => {
          setReportOpt(e.target.value);
        }}
      >
        <option value="">적절한 범주를 선택하세요</option>
        {opt.map((el, idx) => (
          <option value={el} key={idx}>
            {el}
          </option>
        ))}
      </select>
      <textarea
        onChange={(e) => setReport(e.target.value)}
        placeholder="신고 사유를 작성해주세요."
      />
      <span>❗️무분별한 신고는 제재 대상이 될 수 있습니다.</span>
      <Button message="신고하기" />
    </StyledReport>
  );
}

export default Report;
