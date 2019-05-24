import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import PropTypes from 'prop-types';
import Colors from '../modules/Colors';
import { login, checkLocal } from '../actions/authActions';
import { showLoading } from '../actions/baseActions';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../assets/images/bg_screen.png');

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      pin: '',
    };
  }

  componentDidMount() {
    /* eslint-disable no-shadow */
    const {
      showLoading,
      checkLocal,
      auth,
      navigation,
    } = this.props;

    showLoading();
    checkLocal().then(() => {
      if (auth.isAuthenticated) {
        navigation.navigate('HomePage');
      }
    });
  }

  handleClick = () => {
    const { phone, pin } = this.state;
    this.props.login({
      phone,
      pin,
    }).then(() => {
      if (this.props.auth.isAuthenticated) {
        this.props.navigation.navigate('HomePage');
      } else {
        showMessage({
          message: 'Sus datos no son válidos.',
          type: 'danger',
        });
      }
    });
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
              <View style={{ flexDirection: 'row' }} />
            </View>
            <View style={styles.loginInput}>
              <Input
                leftIcon={(
                  <Icon
                    name="mobile"
                    type="font-awesome"
                    color={Colors.Textbox.icon}
                    size={25}
                  />
                )}
                containerStyle={{ marginVertical: 10 }}
                inputStyle={{ marginLeft: 10, color: Colors.Textbox.color }}
                keyboardAppearance="light"
                placeholder="Teléfono"
                autoFocus
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="phone-pad"
                onSubmitEditing={() => { this.secondTextInput.focus(); }}
                returnKeyType="next"
                onChangeText={value => this.setState({ phone: value })}
                maxLength={12}
                blurOnSubmit={false}
                placeholderTextColor={Colors.Textbox.color}
                errorStyle={{ textAlign: 'center', fontSize: 12 }}
              />
              <Input
                leftIcon={(
                  <Icon
                    name="lock"
                    type="font-awesome"
                    color={Colors.Textbox.icon}
                    size={25}
                  />
                )}
                containerStyle={{ marginVertical: 10 }}
                inputStyle={{ marginLeft: 10, color: Colors.Textbox.color }}
                ref={(input) => { this.secondTextInput = input; }}
                secureTextEntry
                keyboardAppearance="light"
                placeholder="Contraseña"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={4}
                keyboardType="number-pad"
                onChangeText={value => this.setState({ pin: value })}
                returnKeyType="done"
                blurOnSubmit
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
              onPress={this.handleClick}
            />
            <View style={styles.footerView} />
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
    marginTop: -100,
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
  auth: state.auth,
});

Login.propTypes = {
  navigation: PropTypes.object,
  auth: PropTypes.object,
  checkLocal: PropTypes.func,
  showLoading: PropTypes.func,
  login: PropTypes.func,
};

export default connect(mapStateToProps, { login, checkLocal, showLoading })(Login);
