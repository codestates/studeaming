import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import notificationReducer from "./notificationReducer";

const rootReducer = combineReducers({
  loginReducer,
  notificationReducer,
});

export default rootReducer;
