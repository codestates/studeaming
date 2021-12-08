import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loadingHandler } from "./store/actions/index";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Mypage from "./pages/Mypage";
import Streamer from "./pages/Streamer";
import Viewer from "./pages/Viewer";
import Verification from "./pages/Verification";
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
import Loading from "./components/Loading";
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
  const { isLoading } = useSelector(({ loadingReducer }) => loadingReducer);
  const isModal =
    isSignupOpen ||
    isSigninOpen ||
    isPwdEditOpen ||
    isWithdrawalOpen ||
    isUserInfoEditOpen ||
    isProfileModalOpen.boolean ||
    isStreamSettingOpen ||
    isDailyLogOpen.boolean ||
    isReportOpen;
  const dispatch = useDispatch();

  useEffect(() => {
    api.interceptors.request.use((config) => {
      dispatch(loadingHandler(true));
      return config;
    }, null);
    api.interceptors.response.use(
      (config) => {
        dispatch(loadingHandler(false));
        return config;
      },
      async (err) => {
        dispatch(loadingHandler(false));
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
      {isLoading ? <Loading /> : null}
      <Header />
      {isSideLogOpen && <SideLog />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/streamer" element={<Streamer />} />
        <Route path="/viewer" element={<Viewer />} />
        <Route path="/auth" element={<Verification />} />
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
          {isReportOpen && <Report />}
        </Modal>
      )}
    </>
  );
}

export default App;
