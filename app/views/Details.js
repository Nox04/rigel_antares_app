import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  StatusBar,
  Image,
  FlatList,
} from 'react-native';
import { Input, Button, Icon, ListItem } from 'react-native-elements';
import Colors from '../modules/Colors';
import {connect} from 'react-redux';
import {showLoading, hideLoading} from '../actions/baseActions';
import axios from 'axios';
import {BASE_URL} from '../config';
import ButtonsBar from '../components/ButtonsBar';
import { showMessage } from "react-native-flash-message";
import { StackActions } from 'react-navigation';

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
      status: null,
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
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        this.props.hideLoading();
      });
  };

  keyExtractor = (item, index) => index.toString();

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

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      subtitle={item.data ? item.data : 'Sin detalles'}
      leftIcon={{ name: item.icon, size: 38 }}
      titleStyle={{fontWeight: "bold"}}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#5d59c3"
          barStyle="light-content"
        />
        <View style={styles.header}></View>
        <Image style={styles.avatar} source={require('../assets/images/user.jpg')}/>

        <View style={styles.bodyContent}>
          <Text style={styles.name}>{this.state.name}</Text>        
        </View>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.info}
          renderItem={this.renderItem}
        />
        <View style={styles.footerContent}>
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
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "white",
    alignSelf:'center',
    marginTop:'-23%'
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600'
  },
  bodyContent: {
    alignItems: 'center',
    marginTop:'1%'
  },
  name:{
    fontSize:28,
    color: "#706eca",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },

  listItemContainer: {
    height: 55,
    borderWidth: 0.5,
    borderColor: '#ECECEC'
  }
});


const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps,{showLoading, hideLoading}) (Details);