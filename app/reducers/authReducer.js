// types
import {LOGOUT, LOGIN, SET_TOKEN} from '../actions/types';

const preloadedState = {
  token: null,
  isAuthenticated: false,
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