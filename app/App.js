import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import store from './store';
import Spinner from 'react-native-loading-spinner-overlay';

import Login from './views/Login';
import Home from './views/Home';
import NewRide from './views/NewRide';

const MainNavigator = createStackNavigator({
  LoginPage: {screen: Login, navigationOptions:{header: null}},
  HomePage: {screen: Home, navigationOptions:{header: null}},
  NewRidePage: {screen: NewRide, navigationOptions:{header: null}},
});

let Navigation = createAppContainer(MainNavigator);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  componentDidMount() {
    store.subscribe(() => {
      this.setState({isLoading: store.getState().base.isLoading});
    });
  }

  render() {
    return (
      <Provider store={store}>
        <Spinner
          visible={this.state.isLoading}
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