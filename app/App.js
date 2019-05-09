import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import store from './store';
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
import {showLoading, hideLoading} from './actions/baseActions';


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
        <Spinner
          visible={store.getState().base.isLoading}
          textContent={'Cargando...'}
          textStyle={styles.spinnerTextStyle}
          overlayColor = {'rgba(0, 0, 0, 0.85)'}
        />
        <Navigation />
      </Provider>
    );
  };
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
}});