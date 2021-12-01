import { GET_FOLLOWS, FOLLOW, UNFOLLOW } from "../actions";

const initState = {
  follows: [],
};

const followReducer = (state = initState, action) => {
  switch (action.type) {
    case GET_FOLLOWS:
      return { follows: action.payload.list };
    case FOLLOW:
      return { follows: state.follows.concat(action.payload.newFollow) };
    case UNFOLLOW:
      return {
        follows: state.follows.filter(
          (follow) => follow.username !== action.payload.username
        ),
      };
    default:
      return state;
  }
};

export default followReducer;
