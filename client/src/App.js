import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Mypage from "./pages/Mypage";
import Streamer from "./pages/Streamer";
import AsmrSound from "./pages/AsmrSound";
import Viewer from "./pages/Viewer";
import Verification from "./pages/Verification";
import NotFound from "./pages/NotFound";
import Modal from "./components/Modal";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import PwdEdit from "./components/PwdEdit";
import Withdrawal from "./components/Withdrawal";
import UserInfoEdit from "./components/UserInfoEdit";
import UserProfile from "./components/UserProfile";
import StreamerSetting from "./components/StreamerSetting";
import Header from "./components/Header";
import SideLog from "./components/SideLog";
import DailyLog from "./components/DailyLog";
import Report from "./components/Report";
import api from "./api/index";
import axios from "axios";

require("dotenv").config();

function App() {
  const {
    isSignupOpen,
    isSigninOpen,
    isPwdEditOpen,
    isWithdrawalOpen,
    isUserInfoEditOpen,
    isProfileModalOpen,
    isStreamSettingOpen,
    isDailyLogOpen,
    isReportOpen,
  } = useSelector(({ modalReducer }) => modalReducer);
  const { isSideLogOpen } = useSelector(({ sideLogReducer }) => sideLogReducer);
  const isModal =
    isSignupOpen ||
    isSigninOpen ||
    isPwdEditOpen ||
    isWithdrawalOpen ||
    isUserInfoEditOpen ||
    isProfileModalOpen.boolean ||
    isStreamSettingOpen ||
    isDailyLogOpen.boolean ||
    isReportOpen.boolean;

  useEffect(() => {
    api.interceptors.response.use(
      (config) => {
        return config;
      },
      async (err) => {
        const originalRequest = err.config;
        if (err.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          await axios.post(
            `${process.env.REACT_APP_BASE_URL}/auth/token`,
            null,
            {
              withCredentials: true,
            }
          );
          return api(originalRequest);
        }
        return Promise.reject(err);
      }
    );
  }, []);

  return (
    <>
      <Header />
      {isSideLogOpen && <SideLog />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/streamer" element={<Streamer />} />
        <Route path="/asmrsound" element={<AsmrSound />} />
        <Route path="/viewer" element={<Viewer />} />
        <Route path="/auth" element={<Verification />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      {isModal && (
        <Modal>
          {isSignupOpen && <Signup />}
          {isSigninOpen && <Signin />}
          {isPwdEditOpen && <PwdEdit />}
          {isWithdrawalOpen && <Withdrawal />}
          {isUserInfoEditOpen && <UserInfoEdit />}
          {isProfileModalOpen.boolean && (
            <UserProfile username={isProfileModalOpen.username} />
          )}
          {isStreamSettingOpen && <StreamerSetting />}
          {isDailyLogOpen.boolean && (
            <DailyLog moment={isDailyLogOpen.moment} />
          )}
          {isReportOpen.boolean && <Report />}
        </Modal>
      )}
    </>
  );
}

export default App;
