import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';

import rootReducer from './reducers/rootReducer';

export default function configureStore() {
  const store = createStore(
    rootReducer,
    applyMiddleware(logger)
  );

  return store;
}
