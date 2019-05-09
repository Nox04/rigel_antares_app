import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {Provider} from 'react-redux';
import store from './store';

import Login from './views/Login';
import Home from './views/Home';

const MainNavigator = createStackNavigator({
  LoginPage: {screen: Login, navigationOptions:{header: null}},
  HomePage: {screen: Home, navigationOptions:{header: null}},
});

let Navigation = createAppContainer(MainNavigator);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  };
}