import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  StatusBar,
  PermissionsAndroid,
  FlatList,
  BackHandler
} from 'react-native';
import { Input, Button, Icon, Header, ListItem, SearchBar } from 'react-native-elements';
import Geolocation from 'react-native-geolocation-service';
import {connect} from 'react-redux';
import {setPermission, setGPS, sendGPS} from '../actions/locationActions';
import {logout, stopWorking, startWorking} from '../actions/authActions';
import {showLoading, hideLoading} from '../actions/baseActions';
import Tts from 'react-native-tts';
import NavigationDrawerLayout from 'react-native-navigation-drawer-layout';
import OneSignal from 'react-native-onesignal';
import { withNavigation } from 'react-navigation';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const list = [
  {
    name: 'Juan David Angarita',
    icon: 'av-timer',
    subtitle: '10 de Mayo 09:30',
    price: '$3000'
  },
  {
    name: 'Carlos José Gonzalez',
    icon: 'flight-takeoff',
    subtitle: '10 de Mayo 08:17',
    price: '$4000'
  },
  {
    name: 'Juan David Angarita',
    icon: 'av-timer',
    subtitle: '10 de Mayo 09:30',
    price: '$3000'
  },
  {
    name: 'Carlos José Gonzalez',
    icon: 'flight-takeoff',
    subtitle: '10 de Mayo 08:17',
    price: '$4000'
  },
  {
    name: 'Juan David Angarita',
    icon: 'av-timer',
    subtitle: '10 de Mayo 09:30',
    price: '$3000'
  },
  {
    name: 'Carlos José Gonzalez',
    icon: 'flight-takeoff',
    subtitle: '10 de Mayo 08:17',
    price: '$4000'
  },
  {
    name: 'Juan David Angarita',
    icon: 'av-timer',
    subtitle: '10 de Mayo 09:30',
    price: '$3000'
  },
  {
    name: 'Carlos José Gonzalez',
    icon: 'flight-takeoff',
    subtitle: '10 de Mayo 08:17',
    price: '$4000'
  },
  {
    name: 'Juan David Angarita',
    icon: 'av-timer',
    subtitle: '10 de Mayo 09:30',
    price: '$3000'
  },
  {
    name: 'Carlos José Gonzalez',
    icon: 'flight-takeoff',
    subtitle: '10 de Mayo 08:17',
    price: '$4000'
  }
];

keyExtractor = (item, index) => index.toString();

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      menu: '',
      type: ''
    }

    OneSignal.init("1a399796-8b22-44bc-828e-22ac3d91966a");
    OneSignal.sendTag('phone', this.props.auth.user.phone);

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
  }

  onOpened = openResult => {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onReceived = () => {
    this.props.navigation.navigate('NewRidePage');
  }

  logout = () => {
    this.props.showLoading();
    this.props.stopWorking().then(() =>{
      this.props.logout().then(() => {
        if(!this.props.auth.isAuthenticated)
          this.props.navigation.navigate('LoginPage');
      });
    });
  }

  stopJourny = () => {
    this.props.showLoading();
    this.props.stopWorking().then(() => {});
  }

  startJourny = () => {
    this.props.showLoading();
    this.props.startWorking().then(() => {
      sendGPS();
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.drawer.closeDrawer();
    this.requestLocationPermission().then( () => {
      this.props.setGPS();
    });
  }

  handleBackButton() {
    return true;
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      ]).then(result => {
        if (result['android.permission.ACCESS_COARSE_LOCATION']
            && result['android.permission.ACCESS_FINE_LOCATION']) {
              this.props.setPermission(true);
            }
      })
      .catch(error => {
        this.props.setPermission(false);
      });
    } catch (err) {
      this.props.setPermission(false);
    }
  } 

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      subtitle={item.subtitle}
      leftIcon={{ name: item.icon, size: 38 }}
      rightTitle={item.price}
    />
  );

  updateSearch = search => {
    this.setState({ search });
  };

  render() {
    const { search } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#fff"
          barStyle="dark-content"
        />
        <NavigationDrawerLayout
        percent={75}
        ref = {_drawer => this.drawer = _drawer}
        type={this.state.type}
        drawerPosition="left"
        window="menu"
        color="#fff"
        backgroundColor="#fff"
        imageBackground={require('../assets/images/menu.jpg')}
        first={'name'}
        second={'phone'}
        account={[
          {
            name: this.props.auth.user.name,
            phone: this.props.auth.user.phone,
            circle: ['transparent', 'transparent'],
          }
        ]}
        menu={[
          {
            type: 'menu',
            name: 'opt1',
            title: 'Iniciar jornada',
            icon: 'play-circle-filled',
            colorText: '#5d59c3',
            colorTextFocus: '#607D8B',
            colorIcon: '#5d59c3',
            colorIconFocus: '#607D8B',
            background: 'transparent',
            backgroundFocus: '#e8e8e8',
            close: true
          },
          {
            type: 'menu',
            name: 'opt2',
            title: 'Terminar jornada',
            icon: 'stop',
            colorText: '#5d59c3',
            colorTextFocus: '#607D8B',
            colorIcon: '#5d59c3',
            colorIconFocus: '#607D8B',
            background: 'transparent',
            backgroundFocus: '#e8e8e8',
            close: true
          },
          {
            type: 'menu',
            name: 'opt3',
            title: 'Cerrar sesión',
            icon: 'exit-to-app',
            colorText: '#5d59c3',
            colorTextFocus: '#607D8B',
            colorIcon: '#5d59c3',
            colorIconFocus: '#607D8B',
            background: 'transparent',
            backgroundFocus: '#e8e8e8',
            close: true
          },
        ]}
        onPress={e => {
          switch (e.name) {
            case 'opt1':
                this.startJourny();
              break;
            case 'opt2':
                this.stopJourny();
              break;
            case 'opt3':
                this.logout();
              break;
          
            default:
              break;
          }
        }}>
          <Header
            placement="left"
            leftComponent={{ icon: 'menu', color: '#5d59c3', size: 32, onPress: () =>{ this.drawer.openDrawer() }}}
            centerComponent={{ text: 'Historial de envíos', style: { color: '#707ba1', fontWeight: '900', fontSize: 24 } }}
            rightComponent={{ icon: 'filter-list', color: '#5d59c3', size: 32 }}
            containerStyle={{
              backgroundColor: '#fff',
              justifyContent: 'space-around',
            }}
          />
          <SearchBar
            round
            containerStyle={{backgroundColor: 'white'}}
            inputContainerStyle={{backgroundColor: '#ebebeb'}}
            placeholderTextColor="#707ba1"
            lightTheme
            placeholder="Buscar..."
            onChangeText={this.updateSearch}
            value={search}
          />
          <FlatList
            keyExtractor={this.keyExtractor}
            data={list}
            renderItem={this.renderItem}
          />
        </NavigationDrawerLayout>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

const mapStateToProps = state => ({
  auth: state.auth,
  location: state.location
});

export default connect(mapStateToProps, {
  setPermission, 
  setGPS,
  logout, 
  showLoading, 
  stopWorking, 
  startWorking
}) (withNavigation(Home));