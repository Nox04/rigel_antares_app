import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {BASE_URL} from '../config';

// types
import {
  LOGOUT,
  LOGIN,
  SET_TOKEN,
} from './types';

const setToken = async token => {
  try {
    await AsyncStorage.setItem('@token', token);
    dispatch({
      type: SET_TOKEN,
      payload: token
    });
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

export const login = data => async dispatch => {
  await axios.post(`${BASE_URL}/mauth/login`, data)
    .then( ({data, headers}) => {
      setToken(headers.authorization);
      dispatch({
        type: LOGIN,
        payload: data.user
      });
    })
    .catch(error => {
      console.log(error);
    });
};

export const logout = () => async dispatch => {
  await axios.get(`${BASE_URL}/mauth/logout`)
    .then(() => {
      setToken(null);
      dispatch({
        type: LOGOUT,
      });
    })
    .catch(error => {
      console.log(error);
    });
};