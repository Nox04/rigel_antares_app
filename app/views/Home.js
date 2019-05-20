import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  StatusBar,
  PermissionsAndroid,
  FlatList
} from 'react-native';
import { Header, ListItem, SearchBar } from 'react-native-elements';
import {connect} from 'react-redux';
import {setPermission, setGPS, sendGPS} from '../actions/locationActions';
import {logout, stopWorking, startWorking} from '../actions/authActions';
import {showLoading, setRides} from '../actions/baseActions';
import NavigationDrawerLayout from 'react-native-navigation-drawer-layout';
import OneSignal from 'react-native-onesignal';
import { withNavigation } from 'react-navigation';
import {BASE_URL} from '../config';
import axios from 'axios';
import { showMessage, hideMessage } from "react-native-flash-message";
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import { StackActions } from 'react-navigation';
import Moment from 'react-moment';

class Home extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      menu: '',
      type: ''
    }

    this.subs = [];

    OneSignal.init("1a399796-8b22-44bc-828e-22ac3d91966a");
    OneSignal.inFocusDisplaying(0);
    OneSignal.enableVibrate(true);
    OneSignal.enableSound(true);
    OneSignal.sendTag('phone', this.props.auth.user.phone);

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.configure();

  }

  onOpened = openResult => {
    if(openResult.action.actionID === '1') {
      axios({
        method: 'POST',
        url: `${BASE_URL}/rides/link`,
        headers:{
          'Authorization':`Bearer ${this.props.auth.token}`
        },
        data: {
          id: openResult.notification.payload.additionalData.ride_id,
          messenger_id: this.props.auth.user.id
        }
      })
      .then( resp => {
        this.props.navigation.dispatch(StackActions.pop());
        this.viewDetails(openResult.notification.payload.additionalData.ride_id);
      })
      .catch( error => {
        showMessage({
          message: "Este domicilio ya fue tomado",
          type: "danger"
        });
      });
    } else if (openResult.action.actionID === '2') {
      this.props.navigation.dispatch(StackActions.pop());
    }
  }

  onReceived = notification => {
    setTimeout(() =>{
      OneSignal.clearOneSignalNotifications();
    }, 20000);
    this.props.navigation.navigate('NewRidePage', { id: notification.payload.additionalData.ride_id });
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
    if(!this.props.auth.isWorking){
      showMessage({
        message: "Su jornada ya fue detenida",
        type: "danger"
      });
      return;
    }

    this.props.showLoading();
    this.props.stopWorking().then(() => {
      if(!this.props.auth.isWorking) {
        showMessage({
          message: "Jornada detenida con éxito",
          type: "success"
        });
        BackgroundGeolocation.stop();
      } else {
        showMessage({
          message: "Ocurrió un error de conectividad",
          type: "danger"
        });
      }
    });
  }

  startJourny = () => {
    if(this.props.auth.isWorking){
      showMessage({
        message: "Su jornada ya fue iniciada",
        type: "danger"
      });
      return;
    }

  this.props.showLoading();
    this.props.startWorking().then(() => {
      if(this.props.auth.isWorking) {
        showMessage({
          message: "Jornada iniciada con éxito",
          type: "success"
        });
        BackgroundGeolocation.checkStatus(status => {
          if (!status.isRunning) {
            BackgroundGeolocation.start();
          }
        });
      } else {
        showMessage({
          message: "Ocurrió un error de conectividad",
          type: "danger"
        });
      }
    });
  }

  componentDidFocus = () => {
    this.props.setRides().then(() => {
    });
  }

  componentWillUnmount() {
    BackgroundGeolocation.removeAllListeners();
    this.subs.forEach(sub => sub.remove());
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
  }

  componentDidMount() {
    this.props.showLoading();
    this.requestLocationPermission().then( () => {
    });

    this.subs = [
      this.props.navigation.addListener('didFocus', this.componentDidFocus)
    ];

    this.drawer.closeDrawer();

    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 200,
      notificationTitle: 'Localización GPS',
      notificationText: 'Activada',
      debug: false,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false
    });

    BackgroundGeolocation.on('location', (location) => {
      if(this.props.auth.isWorking) {
        BackgroundGeolocation.startTask(taskKey => {
          sendGPS(location.latitude, location.longitude).then(() => {
            BackgroundGeolocation.endTask(taskKey);
          })
        });
      }
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      // handle stationary locations here
      Actions.sendLocation(stationaryLocation);
    });

    BackgroundGeolocation.on('error', (error) => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');
    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(() =>
          Alert.alert('La aplicación requiere permisos de GPS', '¿Quieres abrir la configuración?', [
            { text: 'Sí', onPress: () => BackgroundGeolocation.showAppSettings() },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
          ]), 1000);
      }
    });
    if(this.props.auth.isWorking) {
      BackgroundGeolocation.checkStatus(status => {
        if (!status.isRunning) {
          BackgroundGeolocation.start();
        }
      });
    }
  }

  viewDetails = id => {
    this.props.navigation.navigate('DetailsPage', { id: id });
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
      subtitle={item.end ? <Moment>{item.end}</Moment> : 'En proceso'}
      leftIcon={{ name: 'av-timer', size: 38 }}
      rightTitle="$3000"
      containerStyle={{backgroundColor: item.end ? null : '#d4edda'}}
      titleStyle={{fontWeight: "bold"}}
      subtitleStyle={{color: item.end ? null : '#155724'}}
      onPress={() => {this.viewDetails(item.id)}}
      chevron
    />
  );

  keyExtractor = (item, index) => index.toString();

  updateSearch = text => {
    const newData = this.arrayholder.filter(item => {      
      const itemData = `${item.name.title.toUpperCase()}   
      ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;
  
       const textData = text.toUpperCase();
        
       return itemData.indexOf(textData) > -1;    
    });    
  
    this.setState({ data: newData });
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
        statusBar="#ffffff"
        statusBarTransparency={0.3}
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
            rightComponent={{ 
              icon: this.props.auth.isWorking ? 'location-on' : 'location-off', 
              color: this.props.auth.isWorking ? 'green' : 'red', 
              size: 32 
            }}
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
            autoCorrect={false}
          />
          <FlatList
            keyExtractor={this.keyExtractor}
            data={this.props.base.rides}
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
  location: state.location,
  base: state.base
});

export default connect(mapStateToProps, {
  setPermission, 
  setGPS,
  logout, 
  showLoading, 
  stopWorking, 
  startWorking,
  setRides
}) (withNavigation(Home));