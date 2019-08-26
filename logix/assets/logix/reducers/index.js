import {combineReducers} from 'redux';
import InputReducer from './inputReducer';
import ShowReducer from './showReducer'

/**
 * The Root for all of the redux reducers.
 * @param {dict} state - redux state.
 * @param {string} action - Action being input.
 * @return {dict} - initial redux state.
 */
const rootReducer = combineReducers({
  inputPremises: InputReducer,
  shows: ShowReducer,
});

export default rootReducer;
