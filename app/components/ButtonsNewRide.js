import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

const ButtonsNewRide = ({ accept, reject }) => (
  <View style={styles.footerContent}>
    <View>
      <TouchableOpacity style={styles.buttonContainerCancel} onPress={reject}>
        <Icon name="close" color="white" />
        <Text style={styles.finishButton}>Rechazar</Text>
      </TouchableOpacity>
    </View>
    <View>
      <TouchableOpacity style={styles.buttonContainerAccept} onPress={accept}>
        <Icon name="check" color="white" />
        <Text style={styles.finishButton}>Aceptar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  footerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonContainerAccept: {
    marginTop: 10,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    minWidth: '40%',
    borderRadius: 8,
    backgroundColor: '#8dc63f',
    marginLeft: '5%',
  },
  buttonContainerCancel: {
    marginTop: 10,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    minWidth: '40%',
    borderRadius: 8,
    backgroundColor: '#ff4e45',
    marginLeft: '5%',
  },
  finishButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

ButtonsNewRide.propTypes = {
  accept: PropTypes.func,
  reject: PropTypes.func,
};

export default ButtonsNewRide;
