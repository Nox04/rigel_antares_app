import axios from 'axios';
import store from '../store';
import Geolocation from 'react-native-geolocation-service';
import {BASE_URL} from '../config';

// types
import {
  SET_GPS,
  CLEAR_GPS,
  SET_PERMISSION
} from './types';

export const sendGPS = async (latitude, longitude) => {
  await axios({
    method: 'POST',
    url: `${BASE_URL}/messengers/geo`,
    headers:{
      'Authorization':`Bearer ${store.getState().auth.token}`
    },
    data: {
      id: store.getState().auth.user.id,
      latitude: latitude,
      longitude: longitude
    }
  })
  .then( resp => {
    //console.log(resp);
  })
  .catch( error => {
    console.log(error);
  });
}

export const setGPS = () => async dispatch => {
  if (store.getState().location.hasLocationPermission) {
    await Geolocation.watchPosition(
      (position) => {
        dispatch({
          type: SET_GPS,
          payload: {
            latitude:position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
        sendGPS(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, distanceFilter: 5}
    );
  }
};

export const clearGPS = () => async dispatch => {
  await dispatch({
    type: CLEAR_GPS
  });
};

export const setPermission = result => async dispatch => {
  await dispatch({
    type: SET_PERMISSION,
    payload: result
  });
};