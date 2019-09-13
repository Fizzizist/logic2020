/**
 * Class for storing Argument information. An Argument is a set of premises
 * with a conclusion.
 */
class Argument {
  /**
   * Constructor for Argument class.
   * @param {Array} premises - an array of Premises.
   * @param {Premise} conclusion - Premise representing the argument conclusion.
   */
  constructor(premises, conclusion) {
    this.premises = premises;
    this.conclusion = conclusion;
    this.setPremiseIDs();
  }

  /**
   * Function to make sure that the Premise IDs of the argument premises are
   * correct.
   */
  setPremiseIDs() {
    let count = 1;
    this.premises.forEach((premise) => {
      premise.id = 'PR' + count;
      count++;
    });
  }

  /**
   * Getter for premises
   * @return {Array} - An array of premises.
   */
  get premises() {
    return this._premises;
  }

  /**
   * Getter for conclusion.
   * @return {Premise} - conclusion Premise.
   */
  get conclusion() {
    return this._conclusion;
  }

  /**
   * Setter for premises Array
   * @param {Array} prems - Array of Premise objects.
   */
  set premises(prems) {
    this._premises = prems;
    this.setPremiseIDs();
  }

  /**
   * Setter for conclusion.
   * @param {Premise} conc - conclusion Premise.
   */
  set conclusion(conc) {
    this._conclusion = conc;
  }
}

export default Argument;
