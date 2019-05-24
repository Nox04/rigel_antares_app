import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { StackActions } from 'react-navigation';
import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';

import { showLoading, hideLoading } from '../actions/baseActions';
import { BASE_URL } from '../config';
import ButtonsBar from '../components/ButtonsBar';
import RideInfo from '../components/RideInfo';

class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: [
        { name: 'Dirección de salida', data: '', icon: 'location-on' },
        { name: 'Dirección de llegada', data: '', icon: 'location-on' },
        { name: 'Barrio', data: '', icon: 'map' },
        { name: 'Detalles adicionales', data: '', icon: 'details' },
      ],
      name: null,
      phone: null,
      status: 'finished',
      rideId: null,
    };
  }

  componentDidMount() {
    // eslint-disable-next-line no-shadow
    const { showLoading, navigation } = this.props;

    showLoading();
    this.setState({
      rideId: navigation.getParam('id', '0'),
    }, () => {
      this.requestRide();
    });
  }

  finishRide = () => {
    const { rideId } = this.state;

    axios({
      method: 'POST',
      url: `${BASE_URL}/rides/finish`,
      headers: {
        Authorization: `Bearer ${this.props.auth.token}`,
      },
      data: {
        id: rideId,
      },
    })
      .then(() => {
        this.setState({
          status: 'finished',
        });
        showMessage({
          message: 'Domicilio finalizado',
          type: 'success',
        });
        this.props.navigation.dispatch(StackActions.popToTop());
      })
      .catch(() => {})
      .then(() => {
        this.props.hideLoading();
      });
  }

  requestRide = async () => {
    const { rideId, info } = this.state;

    await axios({
      method: 'POST',
      url: `${BASE_URL}/rides/my-ride`,
      headers: {
        Authorization: `Bearer ${this.props.auth.token}`,
      },
      data: {
        id: rideId,
      },
    })
      .then(({ data }) => {
        this.setState({
          info: [
            { ...info[0], data: data.address },
            { ...info[1], data: data.address2 },
            { ...info[2], data: data.neighborhood },
            { ...info[3], data: data.details },
          ],
          name: data.name,
          phone: data.phone,
          status: data.status,
        });
        if (data.status === 'finished') {
          const endDate = moment(data.end);
          const createdAt = moment(data.created_at);
          const diff = endDate.diff(createdAt, 'minutes');
          this.setState({
            info: [...info, { name: 'Tiempo de domicilio', data: `${diff} minutos`, icon: 'av-timer' }],
          });
        }
      })
      .catch(() => {})
      .then(() => {
        this.props.hideLoading();
      });
  }

  render() {
    const {
      info,
      name,
      phone,
      status,
    } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#5d59c3"
          barStyle="light-content"
        />
        <View style={styles.header} />
        <RideInfo info={info} name={name} />
        <View style={styles.buttons}>
          {status !== 'finished' ? <ButtonsBar phone={phone} finish={this.finishRide} /> : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#5d59c3',
    height: '20%',
  },
  buttons: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
});


const mapStateToProps = state => ({
  auth: state.auth,
});

Details.propTypes = {
  navigation: PropTypes.object,
  auth: PropTypes.object,
  showLoading: PropTypes.func,
  hideLoading: PropTypes.func,
};

export default connect(mapStateToProps, { showLoading, hideLoading })(Details);
