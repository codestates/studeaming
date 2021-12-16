import { SIDE_LOG_COMPONENT_OPEN } from "../actions/index";

const initState = {
  isSideLogOpen: false,
};

const sideLogReducer = (state = initState, action) => {
  switch (action.type) {
    case SIDE_LOG_COMPONENT_OPEN:
      return { isSideLogOpen: action.payload };
    default:
      return state;
  }
};

export default sideLogReducer;
