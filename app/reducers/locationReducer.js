// types
import {CLEAR_GPS, SET_GPS, SET_PERMISSION} from '../actions/types';

const preloadedState = {
  latitude: null,
  longitude: null,
  hasLocationPermission: false
};

export default (state = preloadedState, {payload, type}) => {
  switch(type) {
    case CLEAR_GPS:
      return {
        ...state,
        latitude: null,
        longitude: null,
      };
    case SET_GPS:
      return {
        ...state,
        latitude: payload.latitude,
        longitude: payload.longitude,
      };
    case SET_PERMISSION:
      return {
        ...state,
        hasLocationPermission: payload
      };
    default:
      return state;
  }
};