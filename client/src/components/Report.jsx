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
    border: none;
    outline: none;
    margin-bottom: 10px;
  }

  > textarea {
    border: 1px solid;
    width: 100%;
    margin-bottom: 10px;
  }
`;

const Picture = styled.div`
  width: 360px;
  height: 240px;
  position: relative;
  margin-bottom: 10px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  #remove-picture-btn {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    color: transparent;
    font-size: 24px;

    :hover {
      transition: 0.3s;
      background-color: rgba(0, 0, 0, 0.3);
      color: #f5f5f5;
    }
  }
`;

const PictureLabel = styled.label`
  width: 360px;
  height: 240px;
  border: 1px dashed var(--color-black-50);
  font-size: 12px;
  color: #8d8d8d;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 10px;

  + input {
    display: none;
  }
`;

function Report() {
  const { isReportOpen } = useSelector(({ modalReducer }) => modalReducer);
  const [report, setReport] = useState("");
  const [reportOpt, setReportOpt] = useState("");
  const [picture, setPicture] = useState(null);
  const opt = [
    "도박",
    "음란",
    "청소년 유해",
    "저작권 침해",
    "위법행위",
    "기타",
  ];

  const reportRequestHandler = () => {
    // TODO: API 추가 및 report 요청
    console.log(report);
    console.log(reportOpt);
  };

  const getPicture = (event) => {
    const src = event.target.files[0];
    setPicture(URL.createObjectURL(src));
  };

  const removePicture = () => {
    setPicture(null);
  };

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
      {picture ? (
        <Picture onClick={removePicture}>
          <img src={picture} alt="report" />
          <div id="remove-picture-btn">&times;</div>
        </Picture>
      ) : (
        <div>
          <PictureLabel htmlFor="picture-input">
            보다 정확한 사유를 위한 사진 업로드
          </PictureLabel>
          <input
            id="picture-input"
            type="file"
            accept="image/*"
            onChange={getPicture}
          ></input>
        </div>
      )}
      <span>❗️무분별한 신고는 제재 대상이 될 수 있습니다.</span>
      <Button message="신고하기" clickEvent={reportRequestHandler} />
    </StyledReport>
  );
}

export default Report;
