import {createStackNavigator, createAppContainer, createSwitchNavigator} from 'react-navigation';
import React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import store from './store';
import Spinner from 'react-native-loading-spinner-overlay';
import FlashMessage from "react-native-flash-message";
import SplashScreen from 'react-native-splash-screen';

import Login from './views/Login';
import Home from './views/Home';
import NewRide from './views/NewRide';
import Details from './views/Details';

GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

const AppStack = createStackNavigator({ 
  HomePage: {screen: Home, navigationOptions:{header: null}},
  NewRidePage: {screen: NewRide, navigationOptions:{header: null}},
  DetailsPage: {screen: Details, navigationOptions:{header: null}},
});

const AuthStack = createStackNavigator({ 
  LoginPage: {screen: Login, navigationOptions:{header: null}} 
});

const MainNavigator = createSwitchNavigator({
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'Auth',
  }
);

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
    SplashScreen.hide();
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
        <FlashMessage 
          position="top" 
          animationDuration={300}
          hideStatusBar={true}
          icon="auto"
        />
      </Provider>
    );
  };
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
}});