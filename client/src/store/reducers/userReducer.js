import {
  CHANGE_LOGIN_STATE,
  VERIFY_SOCIAL_LOGINED,
  VERIFY_GUEST_LOGINED,
  GET_USERINFO,
  LOGOUT,
} from "../actions/index";

const initState = {
  isLogin: false,
  isSocialLogined: false,
  isGuestLogined: false,
  id: "",
  profileImg: "",
  username: "",
  about: "",
  studeaming: 0,
};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case CHANGE_LOGIN_STATE:
      return { ...state, isLogin: action.payload };
    case VERIFY_SOCIAL_LOGINED:
      return { ...state, isSocialLogined: action.payload };
    case VERIFY_GUEST_LOGINED:
      return { ...state, isGuestLogined: action.payload };
    case GET_USERINFO:
      return { ...state, ...action.payload.data };
    case LOGOUT:
      return { ...initState };
    default:
      return state;
  }
};

export default userReducer;
