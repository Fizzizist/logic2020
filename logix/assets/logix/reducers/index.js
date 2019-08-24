import {NEW_SHOW} from '../actions/actionTypes';

const initialState = {
  derivation: [],
};

/**
 * The Root for all of the redux reducers.
 * @param {dict} state - redux state.
 * @param {string} action - Action being input.
 * @return {dict} - initial redux state.
 */
function rootReducer(state = initialState, action) {
  if (action.type === NEW_SHOW) {
    return Object.assign({}, state, {
      derivation: state.derivation.concat(action.payload),
    });
  }
  return state;
};

export default rootReducer;
