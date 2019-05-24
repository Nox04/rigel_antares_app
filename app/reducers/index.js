import { combineReducers } from 'redux';

// reducers
import authReducer from './authReducer';
import locationReducer from './locationReducer';
import baseReducer from './baseReducer';

export default combineReducers({
  auth: authReducer,
  base: baseReducer,
  location: locationReducer,
});
