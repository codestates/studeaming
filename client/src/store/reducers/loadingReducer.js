import { LOADING_ACTION } from "../actions/index";

const initState = {
  isLoading: false,
};

const loadingReducer = (state = initState, action) => {
  console.log(action.payload);
  switch (action.type) {
    case LOADING_ACTION:
      return { isLoading: action.payload };
    default:
      return state;
  }
};

export default loadingReducer;
