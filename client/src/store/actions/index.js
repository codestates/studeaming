export const CHANGE_LOGIN_STATE = "CHANGE_LOGIN_STATE";
// TODO : 다른 액션 타입 추가
export const ENQUEUE_NOTIFICATION = "ENQUEUE_NOTIFICATION";
export const DEQUEUE_NOTIFICATION = "DEQUEUE_NOTIFICATION";

export const loginStateChange = (boolean) => {
  return {
    type: CHANGE_LOGIN_STATE,
    payload: boolean,
  };
};

// TODO : 다른 액션 추가

export const notify =
  (message, link, dismissTime = 3000) =>
  (dispatch) => {
    const uuid = Math.random();
    dispatch(enqueueNotification(message, link, dismissTime, uuid));
    setTimeout(() => {
      dispatch(dequeueNotification());
    }, dismissTime);
  };

export const enqueueNotification = (message, link, dismissTime, uuid) => {
  return {
    type: ENQUEUE_NOTIFICATION,
    payload: {
      message,
      link,
      dismissTime,
      uuid,
    },
  };
};

export const dequeueNotification = () => {
  return {
    type: DEQUEUE_NOTIFICATION,
  };
};
