import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  StatusBar
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import Colors from '../modules/Colors';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../assets/images/bg_screen.jpg');

export default class Login extends Component {
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
              <Text style={styles.titleText}>Antares</Text>
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
            onPress={() => this.props.navigation.navigate('HomePage')}
            />
            <View style={styles.footerView}>
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
