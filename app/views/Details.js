import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Input, Button, Icon, ListItem } from 'react-native-elements';
import Colors from '../modules/Colors';
import {connect} from 'react-redux';
import BaseIcon from '../components/Icon';

class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: [
        {name: 'Dirección de salida', end: 'Calle 6 Bis # 23 - 44', icon: 'location-on'}, 
        {name: 'Dirección de llegada', end: 'Carrera 10 # 16B - 55', icon: 'location-on'},
        {name: 'Barrio', end: 'La nueva esperanza', icon: 'map'},
        {name: 'Detalles adicionales', end: 'Buscar un trabajo de física que está en la habitación de su casa y llevarlo a portería por la entrada número dos. Además, buscar un trabajo de física que está en la habitación de su casa y llevarlo a portería por la entrada número dos.', icon: 'details'},
      ]
    }
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      subtitle={item.end ? item.end : 'En proceso'}
      leftIcon={{ name: item.icon, size: 38 }}
      containerStyle={{backgroundColor: item.end ? null : '#d4edda'}}
      titleStyle={{fontWeight: "bold"}}
      subtitleStyle={{color: item.end ? null : '#155724'}}
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
        <Image style={styles.avatar} source={{uri: 'https://pps.whatsapp.net/v/t61.24694-24/57883156_2271929879567087_8091423033647955968_n.jpg?oe=5CE1E64B&oh=cfd5a29530627fd73902b7a25cf7b97e'}}/>

        <View style={styles.bodyContent}>
          <Text style={styles.name}>Beimer Osorio</Text>        
        </View>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.info}
          renderItem={this.renderItem}
        />
        <View style={styles.footerContent}>
          <View>
            <TouchableOpacity style={styles.buttonContainer}>
              <Icon name='local-phone' color='white' />
              <Text style={styles.finishButton}>Llamar</Text>  
            </TouchableOpacity>  
          </View>
          <View>
            <TouchableOpacity style={styles.buttonContainer}>
              <Icon name='exit-to-app' color='white' />
              <Text style={styles.finishButton}>Finalizar orden</Text>  
            </TouchableOpacity>
          </View>
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
  footerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
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
  finishButton: {
    color: 'white',
    fontSize:16,
    fontWeight: "500"
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

export default connect(mapStateToProps) (Details);