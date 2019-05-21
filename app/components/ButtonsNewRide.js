import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity
} from 'react-native';
import { Icon } from 'react-native-elements';

export default class ButtonsNewRide extends Component {

  handleAccept = () => {
    this.props.accept();
  }

  handleReject = () => {
    this.props.reject();
  }

  render() {
    return (
      <View style={styles.footerContent}>
        <View>
          <TouchableOpacity style={styles.buttonContainerCancel} onPress={this.handleReject}>
            <Icon name='close' color='white' />
            <Text style={styles.finishButton}>Rechazar</Text>  
          </TouchableOpacity>  
        </View>
        <View>
          <TouchableOpacity style={styles.buttonContainerAccept} onPress={this.handleAccept}>
            <Icon name='check' color='white' />
            <Text style={styles.finishButton}>Aceptar</Text>  
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  buttonContainerAccept: {
    marginTop:10,
    height:60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    minWidth: '40%',
    borderRadius:8,
    backgroundColor: "#8dc63f",
    marginLeft: '5%'
  },
  buttonContainerCancel: {
    marginTop:10,
    height:60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    minWidth: '40%',
    borderRadius:8,
    backgroundColor: "#ff4e45",
    marginLeft: '5%'
  },
  finishButton: {
    color: 'white',
    fontSize:16,
    fontWeight: "500"
  }
});
