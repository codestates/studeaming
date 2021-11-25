import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Main from "./pages/Main";
import Mypage from "./pages/Mypage";
import Streamer from "./pages/Streamer";
import Viewer from "./pages/Viewer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/main" element={<Main />} />
      <Route path="/mypage" element={<Mypage />} />
      <Route path="/streamer" element={<Streamer />} />
      <Route path="/viewer" element={<Viewer />} />
    </Routes>
  );
}

export default App;
