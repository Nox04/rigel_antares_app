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

class Details extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={Colors.StatusBar.color}
          barStyle="light-content"
        />
        <View style={styles.loginView}>
          <View style={{ flexDirection: 'row' }}></View>
          <Text style={styles.titleText}>Domicilio # {this.props.navigation.getParam('id', '0')}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: 'black',
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

export default connect(mapStateToProps) (Details);