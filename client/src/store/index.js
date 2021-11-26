import { compose, createStore, applyMiddleware } from "redux";
import persistReducer from "./reducers/index";
import thunk from "redux-thunk";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : compose;
const store = createStore(
  persistReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
