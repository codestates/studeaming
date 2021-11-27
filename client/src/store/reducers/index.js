import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userReducer";
import modalReducer from "./modalReducer";
import sideLogReducer from "./sideLogReducer";
import notificationReducer from "./notificationReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userReducer"],
};

const rootReducer = combineReducers({
  userReducer,
  modalReducer,
  sideLogReducer,
  notificationReducer,
});

export default persistReducer(persistConfig, rootReducer);
