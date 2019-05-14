import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {BASE_URL} from '../config';
import store from '../store';

// types
import {
  LOGOUT,
  LOGIN,
  SET_TOKEN,
  START_WORKING,
  STOP_WORKING,
  HIDE_LOADING,
  SHOW_LOADING
} from './types';

const setToken = async token => {
  try {
    await AsyncStorage.setItem('@token', token);
  } catch (e) {
    // saving error
  }
}

const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('@token');
    if(value !== null) {
      return value;
    }
  } catch(e) {
    // error reading value
  }
}

export const checkLocal = () => async dispatch => {
  dispatch({
    type: SHOW_LOADING
  });

  const token = await getToken();
  await axios({
    method: 'GET',
    url: `${BASE_URL}/mauth/user`,
    headers:{
      'Authorization':`Bearer ${token}`
    }
  })
  .then( ({data}) => {
    dispatch({
      type: SET_TOKEN,
      payload: token
    });
    dispatch({
      type: LOGIN,
      payload: data.data
    });
    dispatch({
      type: HIDE_LOADING
    });
    return true;
  })
  .catch( error => {
    dispatch({
      type: HIDE_LOADING
    });
    return false;
  });
}

export const login = data => async dispatch => {
  dispatch({
    type: SHOW_LOADING
  });

  await axios.post(`${BASE_URL}/mauth/login`, data)
    .then( ({data, headers}) => {
      setToken(headers.authorization);
      dispatch({
        type: SET_TOKEN,
        payload: headers.authorization
      });
      dispatch({
        type: LOGIN,
        payload: data.user
      });
    })
    .catch(error => {
      console.log(error);
    })
    .then(() => {
      dispatch({
        type: HIDE_LOADING
      });
    });
};

export const stopWorking = () => async dispatch => {
  await axios({
    method: 'POST',
    url: `${BASE_URL}/messengers/stop`,
    headers:{
      'Authorization':`Bearer ${store.getState().auth.token}`
    },
    data: {
      id: store.getState().auth.user.id,
    }
  }).then(() => {
      dispatch({
        type: STOP_WORKING
      });
    })
    .catch(error => {
      console.log(error);
    })
    .then(() => {
      dispatch({
        type: HIDE_LOADING
      });
    });
};

export const startWorking = () => async dispatch => {
  await axios({
    method: 'POST',
    url: `${BASE_URL}/messengers/start`,
    headers:{
      'Authorization':`Bearer ${store.getState().auth.token}`
    },
    data: {
      id: store.getState().auth.user.id,
    }
  }).then(() => {
      dispatch({
        type: START_WORKING
      });
    })
    .catch(error => {
      console.log(error);
    })
    .then(() => {
      dispatch({
        type: HIDE_LOADING
      });
    });
};

export const logout = () => async dispatch => {

  await axios({
    method: 'POST',
    url: `${BASE_URL}/mauth/logout`,
    headers:{
      'Authorization':`Bearer ${store.getState().auth.token}`
    }
  }).then(() => {
      setToken(null);
      dispatch({
        type: LOGOUT,
      });
    })
    .catch(error => {
      console.log(error);
    })
    .then(() => {
      dispatch({
        type: HIDE_LOADING
      });
    });
};