import { combineReducers } from 'redux';

// reducers
import authReducer from './authReducer';
import locationReducer from './locationReducer';

export default combineReducers({
  auth: authReducer,
  location: locationReducer
});