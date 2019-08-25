import {combineReducers} from 'redux';
import InputReducer from './inputReducer';

/**
 * The Root for all of the redux reducers.
 * @param {dict} state - redux state.
 * @param {string} action - Action being input.
 * @return {dict} - initial redux state.
 */
const rootReducer = combineReducers({
  inputPremises: InputReducer,
});

export default rootReducer;
