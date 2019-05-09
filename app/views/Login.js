import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  StatusBar,
  Image,
  PermissionsAndroid
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import Colors from '../modules/Colors';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import {connect} from 'react-redux';
import {login} from '../actions/authActions';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../assets/images/bg_screen.png');
const LOGO = require('../assets/images/logo.png');

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone:'',
      pin:'',
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
        backgroundColor={Colors.StatusBar.color}
        barStyle="light-content"
      />
        <ImageBackground source={BG_IMAGE} style={styles.bgImage} resizeMode="cover">
          <View style={styles.loginView}>
            <View style={styles.loginTitle}>
            <View style={{ flexDirection: 'row' }}>
            </View>
          </View>
          <View style={styles.loginInput}>
            <Input
              leftIcon={
                <Icon
                    name="mobile"
                    type="font-awesome"
                    color={Colors.Textbox.icon}
                    size={25}
                />
              }
              containerStyle={{ marginVertical: 10 }}
              inputStyle={{ marginLeft: 10, color: Colors.Textbox.color }}
              keyboardAppearance="light"
              placeholder="Teléfono"
              autoFocus={true}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="phone-pad"
              onSubmitEditing={() => { this.secondTextInput.focus(); }}
              returnKeyType="next"
              onChangeText = {value => this.setState({phone:value})}
              maxLength={12}
              blurOnSubmit={false}
              placeholderTextColor={Colors.Textbox.color}
              errorStyle={{ textAlign: 'center', fontSize: 12 }}
            />
            <Input
              leftIcon={
                <Icon
                    name="lock"
                    type="font-awesome"
                    color={Colors.Textbox.icon}
                    size={25}
                />
              }
              containerStyle={{ marginVertical: 10 }}
              inputStyle={{ marginLeft: 10, color: Colors.Textbox.color }}
              ref={(input) => { this.secondTextInput = input; }}
              secureTextEntry={true}
              keyboardAppearance="light"
              placeholder="Contraseña"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={4}
              keyboardType="number-pad"
              onChangeText = {value => this.setState({pin:value})}
              returnKeyType="done"
              blurOnSubmit={true}
              placeholderTextColor={Colors.Textbox.color}
            />
            </View>
            <Button
            title="INICIAR SESIÓN"
            activeOpacity={1}
            underlayColor={Colors.Button.background}
            buttonStyle={{
              height: 50,
              width: 250,
              backgroundColor: Colors.Button.background,
              borderWidth: 2,
              borderColor: Colors.Button.border,
              borderRadius: 30,
            }}
            containerStyle={{ marginVertical: 10 }}
            titleStyle={{ fontWeight: 'bold', color: Colors.Button.text }}
            onPress={(event) => this.handleClick(event)}
            />
            <View style={styles.footerView}>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
  handleClick(event) {
    this.props.login({
      phone: this.state.phone,
      pin: this.state.pin
    }).then(() => {
      this.props.navigation.navigate('HomePage');
    });
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
  loginView: {
    marginTop: 150,
    backgroundColor: 'transparent',
    width: 250,
    height: 400,
  },
  loginTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -100
  },
  titleText: {
    color: Colors.Title.color,
    fontSize: 30,
    fontFamily: 'bold',
  },
  loginInput: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerView: {
    marginTop: 20,
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {login}) (Login);