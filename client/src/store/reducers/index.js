import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import loginReducer from "./loginReducer";
import modalReducer from "./modalReducer";
import notificationReducer from "./notificationReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["loginReducer"],
};

const rootReducer = combineReducers({
  loginReducer,
  modalReducer,
  notificationReducer,
});

export default persistReducer(persistConfig, rootReducer);
