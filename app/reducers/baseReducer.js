// types
import {SHOW_LOADING, HIDE_LOADING} from '../actions/types';

const preloadedState = {
  isLoading: false
};

export default (state = preloadedState, {type}) => {
  switch(type) {
    case SHOW_LOADING:
    console.log('llegando');
      return {
        isLoading: true
      };
    case HIDE_LOADING:
      return {
        isLoading: false
      };
    default:
      return state;
  }
};