import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
} from 'react-native';
import { Input, Button, Icon, ListItem } from 'react-native-elements';


export default class Details extends Component {

  keyExtractor = (item, index) => index.toString();

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
      <View>
        <Image style={styles.avatar} source={require('../assets/images/user.jpg')}/>

        <View style={styles.bodyContent}>
          <Text style={styles.name}>{this.props.name}</Text>        
        </View>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.props.info}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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