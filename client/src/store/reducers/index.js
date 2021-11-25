import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import modalReducer from "./modalReducer";
import notificationReducer from "./notificationReducer";

const rootReducer = combineReducers({
  loginReducer,
  modalReducer,
  notificationReducer,
});

export default rootReducer;
