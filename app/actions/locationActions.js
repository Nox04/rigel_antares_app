import axios from 'axios';

// types
import {
  LOGOUT,
  SET_USER,
} from './types';

// const getToken = () => {
//     let token = localStorage.getItem(ACCESS_TOKEN);

//     if (token) {
//         token = JSON.parse(token);

//         axios.defaults.headers.common['Authorization'] = `${TOKEN_TYPE} ${token}`;
//     }

//     return !!token;
// };

// export const setToken = () => ({
//     type: LOGIN,
//     payload: getToken(),
// });

export const login = (url, data) => async dispatch => {
    await axios.post(`${url}/login`, data)
        .then(({data}) => {
            // const {access_token} = data;

            // localStorage.setItem(ACCESS_TOKEN, JSON.stringify(access_token));

            // dispatch({
            //     type: LOGIN,
            //     payload: getToken(),
            // });
        })
        .catch(error => {
          console.log(error);
        });
};

export const logout = (url) => async dispatch => {
    await axios.get(`${url}/logout`)
        .then(() => {
            //localStorage.removeItem(ACCESS_TOKEN);
            dispatch({
                type: LOGOUT,
            });
        })
        .catch(error => {
            console.log(error);
        });
};