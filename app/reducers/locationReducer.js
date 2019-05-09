// types
import {CLEAR_GPS, SET_GPS} from '../actions/types';

const preloadedState = {
  latitude: null,
  longitude: null,
};

export default (state = preloadedState, {payload, type}) => {
  switch(type) {
    case CLEAR_GPS:
      return {
        latitude: null,
        longitude: null,
      };
    case SET_GPS:
      return {
        latitude: payload.latitude,
        longitude: payload.longitude,
      };
    default:
      return state;
  }
};