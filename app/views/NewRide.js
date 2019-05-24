import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';
import { StackActions } from 'react-navigation';
import CountdownCircle from 'react-native-countdown-circle';
import PropTypes from 'prop-types';
import { showLoading, hideLoading } from '../actions/baseActions';
import { BASE_URL } from '../config';
import ButtonsNewRide from '../components/ButtonsNewRide';
import RideInfo from '../components/RideInfo';

class NewRide extends Component {
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

  reject = () => {
    this.props.navigation.dispatch(StackActions.popToTop());
  }

  accept = () => {
    const { rideId } = this.state;

    axios({
      method: 'POST',
      url: `${BASE_URL}/rides/link`,
      headers: {
        Authorization: `Bearer ${this.props.auth.token}`,
      },
      data: {
        id: rideId,
        messenger_id: this.props.auth.user.id,
      },
    })
      .then(() => {
        this.props.navigation.dispatch(StackActions.pop());
        this.props.navigation.navigate('DetailsPage', { id: rideId });
      })
      .catch(() => {
        showMessage({
          message: 'Este domicilio ya fue tomado',
          type: 'danger',
        });
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
          status: data.status,
        });
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
      status,
    } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#5d59c3"
          barStyle="light-content"
        />
        <View style={styles.header}>
          <CountdownCircle
            seconds={20}
            radius={30}
            borderWidth={8}
            color="#8dc63f"
            shadowColor="#fff"
            bgColor="#fff"
            textStyle={{ fontSize: 20 }}
            onTimeElapsed={() => this.reject()}
          />
        </View>
        <RideInfo info={info} name={name} />
        <View style={styles.buttons}>
          {status !== 'finished' ? <ButtonsNewRide reject={this.reject} accept={this.accept} /> : null}
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
    paddingTop: 30,
    paddingLeft: 20,
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

NewRide.propTypes = {
  navigation: PropTypes.object,
  auth: PropTypes.object,
  showLoading: PropTypes.func,
  hideLoading: PropTypes.func,
};

export default connect(mapStateToProps, { showLoading, hideLoading })(NewRide);
