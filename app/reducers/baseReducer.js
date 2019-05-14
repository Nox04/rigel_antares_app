// types
import {SHOW_LOADING, HIDE_LOADING, SET_RIDES} from '../actions/types';

const preloadedState = {
  isLoading: false,
  rides: []
};

export default (state = preloadedState, {type, payload}) => {
  switch(type) {
    case SHOW_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case HIDE_LOADING:
      return {
        ...state,
        isLoading: false
      };
    case SET_RIDES:
      return {
        ...state,
        rides: payload
      };
    default:
      return state;
  }
};