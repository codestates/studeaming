export const CHANGE_LOGIN_STATE = "CHANGE_LOGIN_STATE";
export const VERIFY_SOCIAL_LOGINED = "VERIFY_SOCIAL_LOGINED";
export const VERIFY_GUEST_LOGINED = "VERIFY_GUEST_LOGINED";
export const GET_USERINFO = "GET_USERINFO";
export const LOGOUT = "LOGOUT";
export const GET_FOLLOWS = "GET_FOLLOWS";
export const FOLLOW = "FOLLOW";
export const UNFOLLOW = "UNFOLLOW";
// TODO : 다른 액션 타입 추가
export const SIGNIN_MODAL_OPEN = "SIGNIN_MODAL_OPEN";
export const SIGNUP_MODAL_OPEN = "SIGNUP_MODAL_OPEN";
export const PWDEDIT_MODAL_OPEN = "PWDEDIT_MODAL_OPEN";
export const WITHDRAWAL_MODAL_OPEN = "WITHDRAWAL_MODAL_OPEN";
export const USERINFO_EDIT_MODAL_OPEN = "USERINFO_EDIT_MODAL_OPEN";
export const PROFILE_MODAL_OPEN = "PROFILE_MODAL_OPEN ";
export const STREAM_SETTING_MODAL_OPEN = "STREAM_SETTING_MODAL_OPEN";
export const SIDE_LOG_COMPONENT_OPEN = "SIDE_LOG_COMPONENT_OPEN";
export const DAILY_LOG_OPEN = "DAILY_LOG_OPEN";
export const MODAL_OFF = "MODAL_OFF";
export const LOADING_ACTION = "LOADING_ACTION";
export const GET_STREAM_INFO = "GET_STREAM_INFO";

export const loginStateChange = (boolean) => {
  return {
    type: CHANGE_LOGIN_STATE,
    payload: boolean,
  };
};

export const verifySocialLogined = (boolean) => {
  return {
    type: VERIFY_SOCIAL_LOGINED,
    payload: boolean,
  };
};

export const verifyGuestLogined = (boolean) => {
  return {
    type: VERIFY_GUEST_LOGINED,
    payload: boolean,
  };
};

export const getUserInfo = (data) => {
  return {
    type: GET_USERINFO,
    payload: { data },
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

export const getFollows = (list) => {
  return {
    type: GET_FOLLOWS,
    payload: { list },
  };
};

export const follow = (newFollow) => {
  return {
    type: FOLLOW,
    payload: { newFollow },
  };
};

export const unfollow = (username) => {
  return {
    type: UNFOLLOW,
    payload: { username },
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

export const withdrawalModalOpen = (boolean) => {
  return {
    type: WITHDRAWAL_MODAL_OPEN,
    payload: boolean,
  };
};

export const userInfoEditModalOpen = (boolean) => {
  return {
    type: USERINFO_EDIT_MODAL_OPEN,
    payload: boolean,
  };
};

export const profileModalOpen = (boolean, username) => {
  return {
    type: PROFILE_MODAL_OPEN,
    payload: { boolean, username },
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

export const dailyLogOpen = (boolean, moment) => {
  return {
    type: DAILY_LOG_OPEN,
    payload: { boolean, moment },
  };
};

export const modalOff = () => {
  return {
    type: MODAL_OFF,
  };
};

export const loadingHandler = (boolean) => {
  return {
    type: LOADING_ACTION,
    payload: boolean,
  };
};

export const getStreamingInfo = (data) => {
  return {
    type: GET_STREAM_INFO,
    payload: data,
  };
};
