import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  StatusBar,
  PermissionsAndroid,
  FlatList
} from 'react-native';
import { Input, Button, Icon, Header, ListItem, SearchBar } from 'react-native-elements';
import Geolocation from 'react-native-geolocation-service';
import {connect} from 'react-redux';
import {setPermission, setGPS} from '../actions/locationActions';
import Pusher from 'pusher-js/react-native';
import {PUSHER_CONFIG} from '../config';
import Tts from 'react-native-tts';
import NavigationDrawerLayout from 'react-native-navigation-drawer-layout';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const list = [
  {
    name: 'Juan David Angarita',
    icon: 'av-timer',
    subtitle: '10 de Mayo 09:30',
    price: '$3000'
  },
  {
    name: 'Carlos José Gonzalez',
    icon: 'flight-takeoff',
    subtitle: '10 de Mayo 08:17',
    price: '$4000'
  },
  {
    name: 'Juan David Angarita',
    icon: 'av-timer',
    subtitle: '10 de Mayo 09:30',
    price: '$3000'
  },
  {
    name: 'Carlos José Gonzalez',
    icon: 'flight-takeoff',
    subtitle: '10 de Mayo 08:17',
    price: '$4000'
  },
  {
    name: 'Juan David Angarita',
    icon: 'av-timer',
    subtitle: '10 de Mayo 09:30',
    price: '$3000'
  },
  {
    name: 'Carlos José Gonzalez',
    icon: 'flight-takeoff',
    subtitle: '10 de Mayo 08:17',
    price: '$4000'
  },
  {
    name: 'Juan David Angarita',
    icon: 'av-timer',
    subtitle: '10 de Mayo 09:30',
    price: '$3000'
  },
  {
    name: 'Carlos José Gonzalez',
    icon: 'flight-takeoff',
    subtitle: '10 de Mayo 08:17',
    price: '$4000'
  },
  {
    name: 'Juan David Angarita',
    icon: 'av-timer',
    subtitle: '10 de Mayo 09:30',
    price: '$3000'
  },
  {
    name: 'Carlos José Gonzalez',
    icon: 'flight-takeoff',
    subtitle: '10 de Mayo 08:17',
    price: '$4000'
  }
];

keyExtractor = (item, index) => index.toString();

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      menu: '',
      type: ''
    };

    let config = PUSHER_CONFIG;
    config.auth = {
      headers: {
        Authorization: 'Bearer ' + this.props.auth.token,
      }
    }
    this.pusher = new Pusher(PUSHER_CONFIG.key, config);
    this.pusher.disco
    this.chatChannel = this.pusher.subscribe('private-new-rides'); 
    this.chatChannel.bind('pusher:subscription_succeeded', () => { 
      this.chatChannel.bind('App\\Events\\RideCreated', (data) => { 
        Tts.speak('Nuevo domicilio');
      });
    });
  }

  handleMessage(data) {
    console.log(data);
  }

  componentDidMount() {
    this.drawer.closeDrawer();
    this.requestLocationPermission().then( () => {
      this.props.setGPS();
    });
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      ]).then(result => {
        if (result['android.permission.ACCESS_COARSE_LOCATION']
            && result['android.permission.ACCESS_FINE_LOCATION']) {
              this.props.setPermission(true);
            }
      })
      .catch(error => {
        this.props.setPermission(false);
      });
    } catch (err) {
      this.props.setPermission(false);
    }
  } 

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      subtitle={item.subtitle}
      leftIcon={{ name: item.icon, size: 38 }}
      rightTitle={item.price}
    />
  );

  updateSearch = search => {
    this.setState({ search });
  };

  render() {
    const { search } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#fff"
          barStyle="dark-content"
        />
        <NavigationDrawerLayout
        percent={75}
        ref = {_drawer => this.drawer = _drawer}
        //statusBar="#008cff"
        //statusBarTransparency={0.3}
        type={this.state.type}
        drawerPosition="left"
        window="menu"
        color="#fff"
        backgroundColor="#fff" //303030
        imageBackground="https://c.wallhere.com/photos/aa/44/glare_colorful_bright_circles-679384.jpg!d"
        first={'name'}
        second={'phone'}
        account={[
          {
            name: 'Juan David Angarita',
            phone: '3168819879',
            circle: ['transparent', 'transparent'],
          }
        ]}
        menu={[
          {
            type: 'title',
            title: 'Opciones',
            colorText: '#000',
          },
          { type: 'divider' },
          {
            type: 'menu',
            name: 'opt1',
            title: 'Iniciar jornada',
            icon: 'play-circle-filled',
            colorText: '#000',
            colorTextFocus: '#607D8B',
            colorIcon: '#2f7dc0',
            colorIconFocus: '#607D8B',
            background: 'transparent',
            backgroundFocus: '#e8e8e8',
            close: true
          },
          {
            type: 'menu',
            name: 'opt2',
            title: 'Terminar jornada',
            icon: 'stop',
            colorText: '#000',
            colorTextFocus: '#607D8B',
            colorIcon: '#2f7dc0',
            colorIconFocus: '#607D8B',
            background: 'transparent',
            backgroundFocus: '#e8e8e8',
            close: true
          },
          {
            type: 'menu',
            name: 'opt3',
            title: 'Cerrar sesión',
            icon: 'exit-to-app',
            colorText: '#000',
            colorTextFocus: '#607D8B',
            colorIcon: '#2f7dc0',
            colorIconFocus: '#607D8B',
            background: 'transparent',
            backgroundFocus: '#e8e8e8',
            close: true
          },
        ]}
        onPress={e => {}}>
          <Header
            placement="left"
            leftComponent={{ icon: 'menu', color: '#5d59c3', size: 32, onPress: () =>{ this.drawer.openDrawer() }}}
            centerComponent={{ text: 'Historial de envíos', style: { color: '#707ba1', fontWeight: '900', fontSize: 24 } }}
            rightComponent={{ icon: 'filter-list', color: '#5d59c3', size: 32 }}
            containerStyle={{
              backgroundColor: '#fff',
              justifyContent: 'space-around',
            }}
          />
          <SearchBar
            round
            containerStyle={{backgroundColor: 'white'}}
            inputContainerStyle={{backgroundColor: '#ebebeb'}}
            placeholderTextColor="#707ba1"
            lightTheme
            placeholder="Buscar..."
            onChangeText={this.updateSearch}
            value={search}
          />
          <FlatList
            keyExtractor={this.keyExtractor}
            data={list}
            renderItem={this.renderItem}
          />
        </NavigationDrawerLayout>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

const mapStateToProps = state => ({
  auth: state.auth,
  location: state.location
});

export default connect(mapStateToProps, {setPermission, setGPS}) (Home);