// @flow
import React from 'react';
import { render } from 'react-dom';
import { configureStore, history } from './store/configure-store';
import Root from './root';

const store = configureStore();
const rootEl = document.getElementById('root');

if (rootEl === null) {
  throw new Error('No `Root` element present');
} else {
  render(<Root store={store} history={history} />, rootEl);
}
