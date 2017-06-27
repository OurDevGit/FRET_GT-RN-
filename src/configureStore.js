import Immutable from "immutable";
import { createStore, applyMiddleware } from "redux";
// import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import appReducer from "./redux/reducers";
import fetchAd from "./sagas";

const configureStore = () => {
  const initialState = Immutable.fromJS({
    ad: {}
  });

  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    appReducer,
    initialState,
    applyMiddleware(/*logger, */sagaMiddleware)
  );
  sagaMiddleware.run(fetchAd);

  return store;
};

export default configureStore;
