import { createStore, applyMiddleware, compose } from 'redux';
import { createHashHistory } from 'history';
import { routerMiddleware, routerActions } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';

export const history = createHashHistory();

export const configureStore = initialState => {
  const middleware = [];
  const enhancers = [];

  const logger = createLogger({
    level: 'info',
    collapsed: true,
  });

  if (process.env.NODE_ENV !== 'test') {
    middleware.push(logger);
  }

  const router = routerMiddleware(history);
  middleware.push(router);

  const actionCreators = {
    ...routerActions,
  };

  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        actionCreators,
      })
    : compose;
  /* eslint-enable no-underscore-dangle */

  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers')));
  }

  return store;
};
