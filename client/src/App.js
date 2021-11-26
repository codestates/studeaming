import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signinModalOpen } from "./store/actions/index";
import Landing from "./pages/Landing";
import Main from "./pages/Main";
import Mypage from "./pages/Mypage";
import Streamer from "./pages/Streamer";
import Viewer from "./pages/Viewer";
import Modal from "./components/Modal";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import StreamerSetting from "./components/StreamerSetting";
import Header from "./components/Header";
import NotificationCenter from "./components/NotificationCenter";
import SideLog from "./components/SideLog";
require("dotenv").config();

function App() {
  const { isSignupOpen, isSigninOpen, isStreamSettingOpen } = useSelector(
    ({ modalReducer }) => modalReducer
  );
  const { isSideLogOpen } = useSelector(({ sideLogReducer }) => sideLogReducer);
  const isModal = isSignupOpen || isSigninOpen || isStreamSettingOpen;

  return (
    <>
      <Header />
      <NotificationCenter />
      {/* <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/main" element={<Main />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/streamer" element={<Streamer />} />
        <Route path="/viewer" element={<Viewer />} />
      </Routes> */}
      {isSideLogOpen && <SideLog />}
      {isModal && (
        <Modal>
          {isSignupOpen && <Signup />}
          {isSigninOpen && <Signin />}
          {isStreamSettingOpen && <StreamerSetting />}
        </Modal>
      )}
    </>
  );
}

export default App;
