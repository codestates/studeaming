import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import userAPI from "../api/user";
import { notify, modalOff } from "../store/actions";
import {
  AuthContainer,
  Title,
  InputContainer,
  Desc,
  Input,
  ErrorMsg,
} from "./reusableStyle";
import Button from "./Button";

const ButtonContainer = styled.div`
  width: 220px;
`;

function PwdEdit() {
  const currentPwInput = useRef(null);
  const newPwInput = useRef(null);
  const [password, setPassword] = useState({
    current: "",
    fresh: "",
    check: "",
  });
  const [errorMessage, setErrorMessage] = useState({ fresh: "", check: "" });
  const [isValid, setIsValid] = useState({ fresh: false, check: false });
  const dispatch = useDispatch();
  const regExpPwd = /^(?=.*?[a-z])(?=.*?[0-9]).{8,16}$/i;

  const getPassword = (key) => (e) => {
    setPassword({ ...password, [key]: e.target.value });
  };

  const checkValidation = () => {
    if (regExpPwd.test(password.fresh) || !password.fresh.length) {
      setErrorMessage({ ...errorMessage, fresh: "" });
      setIsValid({ ...isValid, fresh: true });
    } else {
      setErrorMessage({
        ...errorMessage,
        fresh: "8~16자 영문 대 소문자, 숫자를 사용하세요.",
      });
      setIsValid({ ...isValid, fresh: false });
    }
  };

  const checkMatched = () => {
    const { fresh, check } = password;
    if (fresh !== check && fresh.length) {
      setErrorMessage({
        ...errorMessage,
        check: "비밀번호가 일치하지 않습니다.",
      });
      setIsValid({ ...isValid, check: false });
    } else if (!(fresh.length && check.length)) {
      setErrorMessage({ ...errorMessage, check: "" });
      setIsValid({ ...isValid, check: false });
    } else {
      setErrorMessage({ ...errorMessage, check: "" });
      setIsValid({ ...isValid, check: true });
    }
  };

  const pwdEditHandler = () => {
    if (!password.current.length) {
      dispatch(notify("현재 비밀번호를 입력해주세요."));
      currentPwInput.current.focus();
    } else if (isValid.fresh && isValid.check) {
      const encryptedCurrentPwd = crypto.AES.encrypt(
        password.current,
        process.env.REACT_APP_SECRET_KEY
      ).toString();
      const encryptedNewPwd = crypto.AES.encrypt(
        password.fresh,
        process.env.REACT_APP_SECRET_KEY
      ).toString();
      userAPI
        .modifyUserInfo(encryptedCurrentPwd, encryptedNewPwd)
        .then(() => {
          dispatch(notify("비밀번호가 변경되었습니다."));
          dispatch(modalOff());
        })
        .catch((err) => {
          if (err.response.status === 401) {
            dispatch(notify("현재 비밀번호가 일치하지 않습니다."));
            currentPwInput.current.focus();
          }
        });
    }
  };

  useEffect(() => {
    checkMatched();
    // eslint-disable-next-line
  }, [password.check]);

  return (
    <AuthContainer>
      <Title>비밀번호 변경</Title>
      <InputContainer>
        <Desc>현재 비밀번호</Desc>
        <Input
          type="password"
          onChange={getPassword("current")}
          ref={currentPwInput}
        ></Input>
      </InputContainer>
      <InputContainer>
        <Desc>새 비밀번호</Desc>
        <Input
          type="password"
          onChange={getPassword("fresh")}
          onBlur={checkValidation}
          ref={newPwInput}
        ></Input>
        <ErrorMsg>{errorMessage.fresh}</ErrorMsg>
      </InputContainer>
      <InputContainer>
        <Desc>새 비밀번호 확인</Desc>
        <Input
          type="password"
          onChange={getPassword("check")}
          onBlur={checkMatched}
          onKeyUp={(e) => {
            e.key === "Enter" && pwdEditHandler();
          }}
        ></Input>
        <ErrorMsg>{errorMessage.check}</ErrorMsg>
      </InputContainer>
      <ButtonContainer>
        <Button message="변경하기" clickEvent={pwdEditHandler} />
      </ButtonContainer>
    </AuthContainer>
  );
}

export default PwdEdit;
