import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  StatusBar,
  PermissionsAndroid,
  FlatList,
} from 'react-native';
import { Header, ListItem, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import axios from 'axios';
import NavigationDrawerLayout from 'react-native-navigation-drawer-layout';
import OneSignal from 'react-native-onesignal';
import { showMessage } from 'react-native-flash-message';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import PropTypes from 'prop-types';
import { StackActions, withNavigation } from 'react-navigation';
import { setPermission, sendGPS } from '../actions/locationActions';
import { logout, stopWorking, startWorking } from '../actions/authActions';
import { showLoading, setRides } from '../actions/baseActions';
import { BASE_URL } from '../config';


class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      type: '',
    };

    this.subs = [];

    const { auth } = this.props;

    OneSignal.init('1a399796-8b22-44bc-828e-22ac3d91966a');
    OneSignal.inFocusDisplaying(0);
    OneSignal.enableVibrate(true);
    OneSignal.enableSound(true);
    OneSignal.sendTag('phone', auth.user.phone);

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.configure();
  }

  componentDidMount() {
    // eslint-disable-next-line no-shadow
    const { auth, navigation, showLoading } = this.props;

    showLoading();
    this.requestLocationPermission();

    this.subs = [
      navigation.addListener('didFocus', this.componentDidFocus),
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
      stopOnStillActivity: false,
    });

    BackgroundGeolocation.on('location', (location) => {
      if (auth.isWorking) {
        BackgroundGeolocation.startTask((taskKey) => {
          sendGPS(location.latitude, location.longitude).then(() => {
            BackgroundGeolocation.endTask(taskKey);
          });
        });
      }
    });

    BackgroundGeolocation.on('stationary', () => {});

    BackgroundGeolocation.on('error', () => {});

    BackgroundGeolocation.on('start', () => {});

    BackgroundGeolocation.on('stop', () => {});

    BackgroundGeolocation.on('authorization', (status) => {
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(() => {
          Alert.alert('La aplicación requiere permisos de GPS', '¿Quieres abrir la configuración?', [
            { text: 'Sí', onPress: () => BackgroundGeolocation.showAppSettings() },
            { text: 'No', onPress: () => {}, style: 'cancel' },
          ]);
        }, 1000);
      }
    });
    if (auth.isWorking) {
      BackgroundGeolocation.checkStatus((status) => {
        if (!status.isRunning) {
          BackgroundGeolocation.start();
        }
      });
    }
  }

  componentWillUnmount() {
    BackgroundGeolocation.removeAllListeners();
    this.subs.forEach(sub => sub.remove());
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
  }

  componentDidFocus = () => {
    this.props.setRides().then(() => {});
  }

  onOpened = (openResult) => {
    if (openResult.action.actionID === '1') {
      axios({
        method: 'POST',
        url: `${BASE_URL}/rides/link`,
        headers: {
          Authorization: `Bearer ${this.props.auth.token}`,
        },
        data: {
          id: openResult.notification.payload.additionalData.ride_id,
          messenger_id: this.props.auth.user.id,
        },
      })
        .then(() => {
          this.props.navigation.dispatch(StackActions.pop());
          this.viewDetails(openResult.notification.payload.additionalData.ride_id);
        })
        .catch(() => {
          showMessage({
            message: 'Este domicilio ya fue tomado',
            type: 'danger',
          });
        });
    } else if (openResult.action.actionID === '2') {
      this.props.navigation.dispatch(StackActions.pop());
    }
  }

  onReceived = (notification) => {
    setTimeout(() => {
      OneSignal.clearOneSignalNotifications();
    }, 20000);
    this.props.navigation.navigate('NewRidePage', { id: notification.payload.additionalData.ride_id });
  }

  logout = () => {
    this.props.showLoading();
    this.props.stopWorking().then(() => {
      this.props.logout().then(() => {
        if (!this.props.auth.isAuthenticated) {
          BackgroundGeolocation.stop();
          this.props.navigation.navigate('LoginPage');
        }
      });
    });
  }

  stopJourny = () => {
    if (!this.props.auth.isWorking) {
      showMessage({
        message: 'Su jornada ya fue detenida',
        type: 'danger',
      });
      return;
    }

    this.props.showLoading();
    this.props.stopWorking().then(() => {
      if (!this.props.auth.isWorking) {
        showMessage({
          message: 'Jornada detenida con éxito',
          type: 'success',
        });
        BackgroundGeolocation.stop();
      } else {
        showMessage({
          message: 'Ocurrió un error de conectividad',
          type: 'danger',
        });
      }
    });
  }

  startJourny = () => {
    if (this.props.auth.isWorking) {
      showMessage({
        message: 'Su jornada ya fue iniciada',
        type: 'danger',
      });
      return;
    }

    this.props.showLoading();
    this.props.startWorking().then(() => {
      if (this.props.auth.isWorking) {
        showMessage({
          message: 'Jornada iniciada con éxito',
          type: 'success',
        });
        BackgroundGeolocation.checkStatus((status) => {
          if (!status.isRunning) {
            BackgroundGeolocation.start();
          }
        });
      } else {
        showMessage({
          message: 'Ocurrió un error de conectividad',
          type: 'danger',
        });
      }
    });
  }

  viewDetails = (id) => {
    this.props.navigation.navigate('DetailsPage', { id });
  }

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      subtitle={item.end ? item.end : 'En proceso'}
      leftIcon={{ name: 'av-timer', size: 38 }}
      rightTitle="$3000"
      containerStyle={{ backgroundColor: item.end ? null : '#d4edda' }}
      titleStyle={{ fontWeight: 'bold' }}
      subtitleStyle={{ color: item.end ? null : '#155724' }}
      onPress={() => { this.viewDetails(item.id); }}
      chevron
    />
  );

  keyExtractor = (item, index) => index.toString();

  updateSearch = () => {
    // const newData = this.arrayholder.filter((item) => {
    //   const itemData = `${item.name.title.toUpperCase()}
    //   ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;
    //   const textData = text.toUpperCase();
    //   return itemData.indexOf(textData) > -1;
    // });

    // this.setState({ data: newData });
  }

  requestLocationPermission = async () => {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]).then((result) => {
        if (result['android.permission.ACCESS_COARSE_LOCATION']
            && result['android.permission.ACCESS_FINE_LOCATION']) {
          this.props.setPermission(true);
        }
      })
        .catch(() => {
          this.props.setPermission(false);
        });
    } catch (err) {
      this.props.setPermission(false);
    }
  }

  render() {
    const { search, type } = this.state;
    const { auth, base } = this.props;

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
          ref={(_drawer) => { this.drawer = _drawer; }}
          type={type}
          drawerPosition="left"
          window="menu"
          color="#fff"
          backgroundColor="#fff"
          imageBackground={require('../assets/images/menu.jpg')}
          first="name"
          second="phone"
          account={[
            {
              name: auth.user.name,
              phone: auth.user.phone,
              circle: ['transparent', 'transparent'],
            },
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
              close: true,
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
              close: true,
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
              close: true,
            },
          ]}
          onPress={(e) => {
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
          }}
        >
          <Header
            placement="left"
            leftComponent={{
              icon: 'menu',
              color: '#5d59c3',
              size: 32,
              onPress: () => { this.drawer.openDrawer(); },
            }}
            centerComponent={{ text: 'Historial de envíos', style: { color: '#707ba1', fontWeight: '900', fontSize: 24 } }}
            rightComponent={{
              icon: auth.isWorking ? 'location-on' : 'location-off',
              color: auth.isWorking ? 'green' : 'red',
              size: 32,
            }}
            containerStyle={{
              backgroundColor: '#fff',
              justifyContent: 'space-around',
            }}
          />
          <SearchBar
            round
            containerStyle={{ backgroundColor: 'white' }}
            inputContainerStyle={{ backgroundColor: '#ebebeb' }}
            placeholderTextColor="#707ba1"
            lightTheme
            placeholder="Buscar..."
            onChangeText={this.updateSearch}
            value={search}
            autoCorrect={false}
          />
          <FlatList
            keyExtractor={this.keyExtractor}
            data={base.rides}
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
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  location: state.location,
  base: state.base,
});

Home.propTypes = {
  navigation: PropTypes.object,
  auth: PropTypes.object,
  base: PropTypes.object,
  setPermission: PropTypes.func,
  logout: PropTypes.func,
  showLoading: PropTypes.func,
  stopWorking: PropTypes.func,
  startWorking: PropTypes.func,
  setRides: PropTypes.func,
};

export default connect(mapStateToProps, {
  setPermission,
  logout,
  showLoading,
  stopWorking,
  startWorking,
  setRides,
})(withNavigation(Home));
