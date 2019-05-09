// types
import {
  SHOW_LOADING,
  HIDE_LOADING
} from './types';


export const showLoading = () => async dispatch => {
  await dispatch({
    type: SHOW_LOADING
  });
};

export const hideLoading = () => async dispatch => {
  await dispatch({
    type: HIDE_LOADING
  });
};