import { ENQUEUE_NOTIFICATION, DEQUEUE_NOTIFICATION } from "../actions/index";

const initState = {
  notifications: [],
};

const notificationReducer = (state = initState, action) => {
  switch (action.type) {
    case ENQUEUE_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case DEQUEUE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.slice(1),
      };
    default:
      return state;
  }
};

export default notificationReducer;
