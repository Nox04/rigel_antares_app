import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

const ButtonsBar = ({ phone, finish }) => (
  <View style={styles.footerContent}>
    <View>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => { Linking.openURL(`tel:${phone}`); }}
      >
        <Icon name="local-phone" color="white" />
        <Text style={styles.finishButton}>Llamar</Text>
      </TouchableOpacity>
    </View>
    <View>
      <TouchableOpacity style={styles.buttonContainer} onPress={finish}>
        <Icon name="exit-to-app" color="white" />
        <Text style={styles.finishButton}>Finalizar orden</Text>
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
  buttonContainer: {
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
  finishButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

ButtonsBar.propTypes = {
  phone: PropTypes.string,
  finish: PropTypes.func,
};

export default ButtonsBar;
