import { CHANGE_LOGIN_STATE, GET_USERINFO, LOGOUT } from "../actions/index";

const initState = {
  isLogin: false,
  profileImg: "",
  username: "",
  about: "",
  studeaming: 0,
};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case CHANGE_LOGIN_STATE:
      return { ...state, isLogin: action.payload };
    case GET_USERINFO:
      return { ...state, ...action.payload.data };
    case LOGOUT:
      return { ...initState };
    default:
      return state;
  }
};

export default userReducer;
