import {
  CHANGE_LOGIN_STATE,
  VERIFY_SOCIAL_LOGINED,
  GET_USERINFO,
  LOGOUT,
} from "../actions/index";

const initState = {
  isLogin: false,
  isSocialLogined: false,
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
    case GET_USERINFO:
      return { ...state, ...action.payload.data };
    case LOGOUT:
      return { ...initState };
    default:
      return state;
  }
};

export default userReducer;
