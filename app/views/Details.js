import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  FlatList,
} from 'react-native';
import Colors from '../modules/Colors';
import {connect} from 'react-redux';
import {showLoading, hideLoading} from '../actions/baseActions';
import axios from 'axios';
import {BASE_URL} from '../config';
import ButtonsBar from '../components/ButtonsBar';
import RideInfo from '../components/RideInfo';
import { showMessage } from "react-native-flash-message";
import { StackActions } from 'react-navigation';
import moment from 'moment';

class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: [
        {name: 'Dirección de salida', data: '', icon: 'location-on'}, 
        {name: 'Dirección de llegada', data: '', icon: 'location-on'},
        {name: 'Barrio', data: '', icon: 'map'},
        {name: 'Detalles adicionales', data: '', icon: 'details'},
      ],
      name: null,
      phone: null,
      status: 'finished',
      rideId: null
    }
  }

  componentDidMount() {
    this.props.showLoading();
    this.setState({
      rideId: this.props.navigation.getParam('id', '0')
    }, () => {
      this.requestRide();
    });
  }

  async requestRide() {
    await axios({
      method: 'POST',
      url: `${BASE_URL}/rides/my-ride`,
      headers: {
        'Authorization':`Bearer ${this.props.auth.token}`
      },
      data: {
        id: this.state.rideId
      }
    }).then(({data}) => {
        this.setState({
          info: [
            {...this.state.info[0], data: data.address},
            {...this.state.info[1], data: data.address2},
            {...this.state.info[2], data: data.neighborhood},
            {...this.state.info[3], data: data.details}
          ],
          name: data.name,
          phone: data.phone,
          status: data.status
        });
        if(data.status === 'finished') {
          const endDate = moment(data.end);
          const createdAt = moment(data.created_at);
          const diff = endDate.diff(createdAt, 'minutes');
          this.setState({
            info: [...this.state.info, {name: 'Tiempo de domicilio', data: `${diff} minutos`, icon: 'av-timer'}]
          });
        }
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        this.props.hideLoading();
      });
  };

  finishRide = () => {
    axios({
      method: 'POST',
      url: `${BASE_URL}/rides/finish`,
      headers: {
        'Authorization':`Bearer ${this.props.auth.token}`
      },
      data: {
        id: this.state.rideId
      }
    }).then(({data}) => {
        this.setState({
          status: 'finished'
        });
        showMessage({
          message: "Domicilio finalizado",
          type: "success"
        });
        this.props.navigation.dispatch(StackActions.popToTop())
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        this.props.hideLoading();
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#5d59c3"
          barStyle="light-content"
        />
        <View style={styles.header}></View>
        <RideInfo info={this.state.info} name={this.state.name} />
        <View style={styles.buttons} >
          {this.state.status !== 'finished' ? <ButtonsBar phone={this.state.phone} finish={this.finishRide} /> : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header:{
    backgroundColor: "#5d59c3",
    height:'20%'
  },
  buttons:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginBottom: 10
  },
});


const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps,{showLoading, hideLoading}) (Details);