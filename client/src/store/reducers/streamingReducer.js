import { GET_STREAM_INFO } from "../actions";

const initState = {
  title: "",
  thumbnail: "",
  sound: "",
};

const streamingReducer = (state = initState, action) => {
  switch (action.type) {
    case GET_STREAM_INFO:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default streamingReducer;
