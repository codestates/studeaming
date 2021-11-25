export const CHANGE_LOGIN_STATE = "CHANGE_LOGIN_STATE";
// TODO : 다른 액션 타입 추가
export const SIGNIN_MODAL_OPEN = "SIGNIN_MODAL_OPEN";
export const SIGNUP_MODAL_OPEN = "SIGNUP_MODAL_OPEN";
export const MODAL_OFF = "MODAL_OFF";
export const ENQUEUE_NOTIFICATION = "ENQUEUE_NOTIFICATION";
export const DEQUEUE_NOTIFICATION = "DEQUEUE_NOTIFICATION";

export const loginStateChange = (boolean) => {
  return {
    type: CHANGE_LOGIN_STATE,
    payload: boolean,
  };
};

// TODO : 다른 액션 추가
export const signinModalOpen = () => {
  return {
    type: SIGNIN_MODAL_OPEN,
  };
};

export const signupModalOpen = () => {
  return {
    type: SIGNUP_MODAL_OPEN,
  };
};

export const modalOff = () => {
  return {
    type: MODAL_OFF,
  };
};

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
