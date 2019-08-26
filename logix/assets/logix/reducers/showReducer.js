import {NEW_SHOW, SHOW_SOLVED} from '../actions/actionTypes';

const initialState = [{
  solved: false,
}];

/**
 * showReducer for holding Show objects in the redux state.
 * @param {dict} state - redux state.
 * @param {string} action - Action being performed.
 * @return {dict} - new updated state.
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case NEW_SHOW:
      return state;
    case SHOW_SOLVED:
      return state.map((i) => ({...i, solved: action.payload}));
    default:
      return state;
  }
}
