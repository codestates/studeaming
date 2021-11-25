import { useSelector } from "react-redux";
import Notification from "./Notification";

function NofiticationCenter() {
  const { notifications } = useSelector(
    ({ notificationReducer }) => notificationReducer
  );

  return (
    <>
      {notifications.map((noti) => (
        <Notification
          key={noti.uuid}
          message={noti.message}
          link={noti.link}
          time={noti.dismissTime}
        />
      ))}
    </>
  );
}

export default NofiticationCenter;
