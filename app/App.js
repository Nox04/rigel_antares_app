import {createStackNavigator, createAppContainer} from 'react-navigation';

import Login from './views/Login';
import Home from './views/Home';

const MainNavigator = createStackNavigator({
  LoginPage: {screen: Login, navigationOptions:{header: null}},
  HomePage: {screen: Home, navigationOptions:{header: null}},
});

const App = createAppContainer(MainNavigator);

export default App;