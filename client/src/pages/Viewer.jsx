import SteamerSetting from "../components/StreamerSetting";
import Chat from "../components/Chat";

function Viewer() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <SteamerSetting />
      <Chat />
    </div>
  );
}

export default Viewer;
