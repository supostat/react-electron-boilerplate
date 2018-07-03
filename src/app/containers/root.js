import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

class Root extends Component {
  render() {
    return (
      <Provider>
        <ConnectedRouter />
      </Provider>
    );
  }
}

export default Root;
