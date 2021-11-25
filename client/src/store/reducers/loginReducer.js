import { CHANGE_LOGIN_STATE } from "../actions/index";

const initState = {
  isLogin: false,
};

const loginReducer = (state = initState, action) => {
  switch (action.type) {
    case CHANGE_LOGIN_STATE:
      return { ...state, isLogin: action.payload };
    default:
      return state;
  }
};

export default loginReducer;
