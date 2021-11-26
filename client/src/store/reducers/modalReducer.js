import {
  SIGNIN_MODAL_OPEN,
  SIGNUP_MODAL_OPEN,
  STREAM_SETTING_MODAL_OPEN,
  MODAL_OFF,
} from "../actions/index";

const initState = {
  isSigninOpen: false,
  isSignupOpen: false,
  isStreamSettingOpen: false,
};

const modalReducer = (state = initState, action) => {
  switch (action.type) {
    case SIGNIN_MODAL_OPEN:
      return { ...state, isSigninOpen: action.payload };
    case SIGNUP_MODAL_OPEN:
      return { ...state, isSignupOpen: action.payload };
    case STREAM_SETTING_MODAL_OPEN:
      return { ...state, isStreamSettingOpen: action.payload };
    case MODAL_OFF:
      return { ...initState };
    default:
      return state;
  }
};

export default modalReducer;
