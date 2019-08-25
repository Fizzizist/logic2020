import {SUBMIT_COMMAND} from './actionTypes';

/**
 * Action to add the resulting premise of a command to the redux state.
 * @param {Premise} premise - The premise being submitted.
 * @return {dict} - containing action type and payload.
 */
export function submitCommandAction(premise) {
  return {
    type: SUBMIT_COMMAND,
    payload: premise,
  };
}
