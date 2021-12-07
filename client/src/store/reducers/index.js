import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userReducer";
import modalReducer from "./modalReducer";
import sideLogReducer from "./sideLogReducer";
import followReducer from "./followReducer";
import loadingReducer from "./loadingReducer";
import streamingReducer from "./streamingReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userReducer"],
};

const rootReducer = combineReducers({
  userReducer,
  modalReducer,
  sideLogReducer,
  followReducer,
  loadingReducer,
  streamingReducer,
});

export default persistReducer(persistConfig, rootReducer);
