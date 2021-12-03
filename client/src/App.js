import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Landing from "./pages/Landing";
import Main from "./pages/Main";
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
import NotificationCenter from "./components/NotificationCenter";
import SideLog from "./components/SideLog";
import DailyLog from "./components/DailyLog";

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
    isDailyLogOpen.boolean;

  return (
    <>
      <Header />
      {isSideLogOpen && <SideLog />}
      <NotificationCenter />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/main" element={<Main />} />
        <Route path="/mypage" element={<Mypage />} />
        {/* <Route path="/streamer" element={<Streamer />} /> */}
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
        </Modal>
      )}
    </>
  );
}

export default App;
