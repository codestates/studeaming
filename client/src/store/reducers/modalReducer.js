import {
  SIGNIN_MODAL_OPEN,
  SIGNUP_MODAL_OPEN,
  MODAL_OFF,
} from "../actions/index";

const initState = {
  isSigninOpen: false,
  isSignupOpen: false,
};

const modalReducer = (state = initState, action) => {
  switch (action.type) {
    case SIGNIN_MODAL_OPEN:
      return { ...state, isSigninOpen: true };
    case SIGNUP_MODAL_OPEN:
      return { ...state, isSignupOpen: true };
    case MODAL_OFF:
      return { ...initState };
    default:
      return state;
  }
};

export default modalReducer;
