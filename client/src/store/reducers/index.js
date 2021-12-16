import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userReducer";
import modalReducer from "./modalReducer";
import sideLogReducer from "./sideLogReducer";
import followReducer from "./followReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["followReducer", "userReducer"],
};

const rootReducer = combineReducers({
  userReducer,
  modalReducer,
  sideLogReducer,
  followReducer,
});

export default persistReducer(persistConfig, rootReducer);
