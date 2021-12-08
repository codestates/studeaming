import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { notification } from "antd";
import "antd/dist/antd.css";
import authAPI from "../api/auth";

function Verification() {
  const { isSigninOpen } = useSelector((state) => state.modalReducer);
  const navigate = useNavigate();

  const getVerificationCode = () => {
    const url = new URL(window.location.href);
    const authorizationCode = url.searchParams.get("code");
    authAPI
      .verification(authorizationCode)
      .then(() => {
        notification.open({
          message: (
            <div style={{ fontSize: "1rem" }}>
              이메일 인증이 완료되었습니다.
            </div>
          ),
          description: (
            <div style={{ fontSize: "0.8rem" }}>로그인 후 사용해주세요.</div>
          ),
        });
      })
      .catch(() => {
        notification.open({
          message: (
            <div style={{ fontSize: "1rem" }}>이메일 인증에 실패했습니다.</div>
          ),
        });
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
