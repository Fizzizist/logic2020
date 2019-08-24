import {NEW_SHOW} from './actionTypes';

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
