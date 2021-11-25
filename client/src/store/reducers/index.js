import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import modalReducer from "./modalReducer";
import notificationReducer from "./notificationReducer";

const rootReducer = combineReducers({
  modalReducer,
});

export default rootReducer;
