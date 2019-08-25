import {SUBMIT_COMMAND} from '../actions/actionTypes';

const initialState = [{
  premises: [],
}];

/**
 * Function to actually alter state based on a given action.
 * @param {dict} state - dict of current redux state.
 * @param {string} action - action to be performed.
 * @return {dict} - new redux state.
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case SUBMIT_COMMAND:
      return state.map((i) =>
        ({...i, premises: [...i.premises, action.payload]}));
    default:
      return state;
  }
}
