import axios from 'axios';
import { BASE_URL } from '../config';
import store from '../store';

// types
import {
  SHOW_LOADING,
  HIDE_LOADING,
  SET_RIDES,
} from './types';


export const showLoading = () => async (dispatch) => {
  await dispatch({
    type: SHOW_LOADING,
  });
};

export const hideLoading = () => async (dispatch) => {
  await dispatch({
    type: HIDE_LOADING,
  });
};

export const setRides = () => async (dispatch) => {
  await axios({
    method: 'POST',
    url: `${BASE_URL}/messengers/rides`,
    headers: {
      Authorization: `Bearer ${store.getState().auth.token}`,
    },
    data: {
      id: store.getState().auth.user.id,
    },
  })
    .then((resp) => {
      dispatch({
        type: SET_RIDES,
        payload: resp.data,
      });
    })
    .catch(() => {})
    .then(() => {
      dispatch({
        type: HIDE_LOADING,
      });
    });
};
