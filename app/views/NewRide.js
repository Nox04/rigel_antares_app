import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  StatusBar,
  Image
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import Colors from '../modules/Colors';
import {connect} from 'react-redux';

class NewRide extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <StatusBar
          backgroundColor={Colors.StatusBar.color}
          barStyle="light-content"
        />
        <Text>Nuevo Domicilio</Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps) (NewRide);