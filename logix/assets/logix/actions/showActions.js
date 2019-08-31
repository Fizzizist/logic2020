import {NEW_SHOW, SHOW_SOLVED} from './actionTypes';

/**
 * Action for a new Show window.
 * @param {string} payload - string of the thing to be shown.
 * @return {dict} - dictionary with type and payload.
 */
export function newShow(payload) {
  return {
    type: NEW_SHOW,
    payload,
  };
}

/**
 * Action to turn the solved bool true in redux state when the user solves the
 * show.
 * @param {bool} payload - boolean of the solved variable.
 * @return {dict} - dict with type and payload.
 */
export function showSolved(payload) {
  return {
    type: SHOW_SOLVED,
    payload: payload,
  };
}
