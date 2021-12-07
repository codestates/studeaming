import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { signinModalOpen } from "../store/actions";
import authAPI from "../api/auth";

function Verification() {
  const { isSigninOpen } = useSelector((state) => state.modalReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getVerificationCode = () => {
    const url = new URL(window.location.href);
    const authorizationCode = url.searchParams.get("code");
    console.log(authorizationCode);
    authAPI
      .verification(authorizationCode)
      .then(() => {
        // notify("이메일 인증이 완료되었습니다. 로그인 후 사용해주세요") 추가
        dispatch(signinModalOpen(true));
      })
      .catch(() => {
        // notify("이메일 인증에 실패했습니다.") 추가
      });
  };

  useEffect(() => {
    getVerificationCode();
    if (!isSigninOpen) {
      navigate("/home");
    }
  }, [isSigninOpen]);

  return <></>;
}

export default Verification;
