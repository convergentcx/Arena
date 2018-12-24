import { routerMiddleware } from 'connected-react-router';
import { drizzleSagas } from 'drizzle';
import { createHashHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import rootReducer from './reducers';

function* rootSaga() {
  yield all(drizzleSagas.map(saga => fork(saga)));
}

function configureStore(initialState = {}, history) {
  const sagaMiddleware = createSagaMiddleware();

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    rootReducer(history),
    initialState,
    composeEnhancers(applyMiddleware(routerMiddleware(history), sagaMiddleware))
  );

  sagaMiddleware.run(rootSaga);
  return store;
}

const history = createHashHistory();
const store = configureStore({}, history);

export { store, history };
