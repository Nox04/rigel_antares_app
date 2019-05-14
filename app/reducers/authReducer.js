// types
import {LOGOUT, LOGIN, SET_TOKEN, START_WORKING, STOP_WORKING} from '../actions/types';

const preloadedState = {
  token: null,
  isAuthenticated: false,
  isWorking: false,
  user: {},
};

export default (state = preloadedState, {payload, type}) => {
  switch(type) {
    case LOGOUT:
      return {
        hasToken: null,
        isAuthenticated: false,
        user: {},
      };

    case START_WORKING:
      return {
        ...state,
        isWorking: true
      }

    case STOP_WORKING:
      return {
        ...state,
        isWorking: false
      }  
      
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: payload,
      };

    case SET_TOKEN:
      return {
        ...state,
        token: payload
      };

    default:
      return state;
  }
};