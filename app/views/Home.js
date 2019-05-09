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

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../assets/images/bg_screen.jpg');

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasLocationPermission: true
    }
  }
  componentDidMount() {
    this.requestLocationPermission().then( () => {
      if (this.state.hasLocationPermission) {
        Geolocation.watchPosition(
            (position) => {
                console.log(position);
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true}
        );
      }
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
              this.setState({
                hasLocationPermission: true
              });
            }
      })
      .catch(error => {
        console.log(error);
      });
    } catch (err) {
      console.warn(err);
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
                <Text style={styles.travelText}>HOME</Text>
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
    alignItems: 'center',
  },
  travelText: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'bold',
  }
});
