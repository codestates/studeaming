import Screen from "../components/Screen";
import Chat from "../components/Chat";

function Viewer() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Screen />
      <Chat />
    </div>
  );
}

export default Viewer;
