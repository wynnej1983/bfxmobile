import React, { Component } from 'react';
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';

import App from './src/App';
import configureStore from './src/store';

const store = configureStore();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

registerRootComponent(Root);
