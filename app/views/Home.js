import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  StatusBar,
  PermissionsAndroid
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import Geolocation from 'react-native-geolocation-service';
import {connect} from 'react-redux';
import {setPermission, setGPS} from '../actions/locationActions';
import Pusher from 'pusher-js/react-native';
import {PUSHER_CONFIG} from '../config';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const BG_IMAGE = require('../assets/images/main.jpg');

class Home extends Component {
  constructor(props) {
    super(props);

    let config = PUSHER_CONFIG;
    config.auth = {
      headers: {
        Authorization: 'Bearer ' + this.props.auth.token,
      }
    }
    this.pusher = new Pusher(PUSHER_CONFIG.key, config); // (1)
    this.chatChannel = this.pusher.subscribe('private-new-rides'); // (2)
    this.chatChannel.bind('pusher:subscription_succeeded', () => { // (3)
      console.log('done');
      this.chatChannel.bind('join', (data) => { // (4)
        this.handleJoin(data.name);
      });
      this.chatChannel.bind('part', (data) => { // (5)
        this.handlePart(data.name);
      });
      this.chatChannel.bind('message', (data) => { // (6)
        this.handleMessage(data.name, data.message);
      });
    });
  }

  handleJoin(name) { // (4)
    console.log(name);
  }

  handlePart(name) { // (5)
    console.log(name);
  }

  handleMessage(name, message) { // (6)
    console.log(name, message);
  }

  componentDidMount() {
    this.requestLocationPermission().then( () => {
      this.props.setGPS();
    });
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

  render() {
    return (
      <View style={styles.container}>
      <StatusBar
        backgroundColor="#314F85"
        barStyle="light-content"
      />
        <ImageBackground  source={BG_IMAGE} style={styles.bgImage}>
          <View style={styles.loginView}>
            <View style={styles.loginTitle}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.travelText}>Bienvenido {this.props.auth.user.name.substring(0, this.props.auth.user.name.indexOf(' '))}</Text>
                
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.travelText}>{`${this.props.location.latitude} - ${this.props.location.longitude}`}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT + 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  travelText: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'bold'
  },
  loginTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  location: state.location
});

export default connect(mapStateToProps, {setPermission, setGPS}) (Home);