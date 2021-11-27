export const CHANGE_LOGIN_STATE = "CHANGE_LOGIN_STATE";
export const GET_USERINFO = "GET_USERINFO";
export const LOGOUT = "LOGOUT";
// TODO : 다른 액션 타입 추가
export const SIGNIN_MODAL_OPEN = "SIGNIN_MODAL_OPEN";
export const SIGNUP_MODAL_OPEN = "SIGNUP_MODAL_OPEN";
export const PWDEDIT_MODAL_OPEN = "PWDEDIT_MODAL_OPEN";
export const USERINFO_MODAL_OPEN = "USERINFO_MODAL_OPEN";
export const STREAM_SETTING_MODAL_OPEN = "STREAM_SETTING_MODAL_OPEN";
export const SIDE_LOG_COMPONENT_OPEN = "SIDE_LOG_COMPONENT_OPEN";
export const MODAL_OFF = "MODAL_OFF";
export const ENQUEUE_NOTIFICATION = "ENQUEUE_NOTIFICATION";
export const DEQUEUE_NOTIFICATION = "DEQUEUE_NOTIFICATION";

export const loginStateChange = (boolean) => {
  return {
    type: CHANGE_LOGIN_STATE,
    payload: boolean,
  };
};

export const getUserInfo = (data) => {
  return {
    type: GET_USERINFO,
    payload: data,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

// TODO : 다른 액션 추가
export const signinModalOpen = (boolean) => {
  return {
    type: SIGNIN_MODAL_OPEN,
    payload: boolean,
  };
};

export const signupModalOpen = (boolean) => {
  return {
    type: SIGNUP_MODAL_OPEN,
    payload: boolean,
  };
};

export const pwdEditModalOpen = (boolean) => {
  return {
    type: PWDEDIT_MODAL_OPEN,
    payload: boolean,
  };
};

export const userInfoEditModalOpen = (boolean) => {
  return {
    type: USERINFO_MODAL_OPEN,
    payload: boolean,
  };
};

export const streamSettingModalOpen = (boolean) => {
  return {
    type: STREAM_SETTING_MODAL_OPEN,
    payload: boolean,
  };
};

export const sideLogOpen = (boolean) => {
  return {
    type: SIDE_LOG_COMPONENT_OPEN,
    payload: boolean,
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
