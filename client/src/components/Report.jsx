import { useState } from "react";
import styled from "styled-components";
import Button from "./Button";

const StyledReport = styled.section`
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;

  > select {
    margin-bottom: 10px;
  }

  > textarea {
    border: 1px solid;
    width: 162.8px;
    margin-bottom: 10px;
  }
`;

function Report() {
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
      <Button message="신고하기" />
    </StyledReport>
  );
}

export default Report;
