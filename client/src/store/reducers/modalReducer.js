import {
  SIGNIN_MODAL_OPEN,
  SIGNUP_MODAL_OPEN,
  PWDEDIT_MODAL_OPEN,
  WITHDRAWAL_MODAL_OPEN,
  USERINFO_EDIT_MODAL_OPEN,
  PROFILE_MODAL_OPEN,
  STREAM_SETTING_MODAL_OPEN,
  DAILY_LOG_OPEN,
  MODAL_OFF,
} from "../actions/index";

const initState = {
  isSigninOpen: false,
  isSignupOpen: false,
  isPwdEditOpen: false,
  isWithdrawalOpen: false,
  isUserInfoEditOpen: false,
  isProfileModalOpen: { boolean: false, username: "" },
  isStreamSettingOpen: false,
  isDailyLogOpen: { boolean: false, date: "" },
};

const modalReducer = (state = initState, action) => {
  switch (action.type) {
    case SIGNIN_MODAL_OPEN:
      return { ...state, isSigninOpen: action.payload };
    case SIGNUP_MODAL_OPEN:
      return { ...state, isSignupOpen: action.payload };
    case PWDEDIT_MODAL_OPEN:
      return { ...state, isPwdEditOpen: action.payload };
    case WITHDRAWAL_MODAL_OPEN:
      return { ...state, isWithdrawalOpen: action.payload };
    case USERINFO_EDIT_MODAL_OPEN:
      return { ...state, isUserInfoEditOpen: action.payload };
    case PROFILE_MODAL_OPEN:
      return { ...state, isProfileModalOpen: { ...action.payload } };
    case STREAM_SETTING_MODAL_OPEN:
      return { ...state, isStreamSettingOpen: action.payload };
    case DAILY_LOG_OPEN:
      return { ...state, isDailyLogOpen: { ...action.payload } };
    case MODAL_OFF:
      return { ...initState };
    default:
      return state;
  }
};

export default modalReducer;
