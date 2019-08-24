/**
 * Class for storing Premise information. A premise can be an atomic or several
 * other types.
 */
class Premise {
  /**
   * Constructor for the Premise class that sets it's values based on the type
   * of premise that it is.
   *
   * @param {string} type - String representing the type of premise that it is.
   * @param {string | Premise} premise1 - Either a string symbol for an atomic
   * or a nexted premise object.
   * @param {Premise | null} premise2 - Either a second Premise or null for
   * things like atomics.
   * @param {string | null} id - String representing the short identifier for
   * the premise in the Show window if necessary.
   */
  constructor({type = '', premise1 = '', premise2 = null, id = null}) {
    this.id = id;
    this.type = type;
    switch (type) {
      case 'not':
        this.premise = premise1;
        break;
      case 'atomic':
        this.symbol = premise1;
        break;
      case 'conditional':
        this.ante = premise1;
        this.cons = premise2;
        this.antiAssumed = false;
        break;
      case 'and':
      case 'or':
      case 'biconditional':
        this.premise1 = premise1;
        this.premise2 = premise2;
        break;
    }
  }

  /**
   * Getter for the string of the premise.
   * @return {string} - String representing the premise.
   */
  getPremiseString() {
    switch (this.type) {
      case 'atomic':
        return this.symbol;
        break;
      case 'not':
        return `~${this.premise.getPremiseString()}`;
        break;
      case 'conditional':
        return `${this.ante.getPremiseString()} → ` +
          `${this.cons.getPremiseString()}`;
        break;
      case 'biconditional':
        return `${this.premise1.getPremiseString()} ↔ ` +
          `${this.premise2.getPremiseString()}`;
        break;
      case 'and':
        return `${this.premise1.getPremiseString()} ^ ` +
          `${this.premise2.getPremiseString()}`;
        break;
      case 'or':
        return `${this.premise1.getPremiseString()} v ` +
          `${this.premise2.getPremiseString()}`;
        break;
    }
  }

  /**
   * Getter for the type of the Premise.
   * @return {string} - String representing the type of the premise.
   */
  getType() {
    return this.type;
  }

  /**
   * Getter for the short identifier of the premise.
   * @return {string} - String representing the identifier for the premise.
   */
  getID() {
    return this.id;
  }

  /**
   * Getter for assumed variable if the premise is of conditional type.
   * @return {bool} - Boolean representing the state of the antiAssumed variable
   */
  getAnteAssumed() {
    return this.anteAssumed;
  }

  /**
   * Getter for the antecedent Premise object if type is 'conditional'
   * @return {Premise} - Premise object which is the antecedent in the
   * conditional.
   */
  getAntecedent() {
    return this.ante;
  }

  /**
   * Getter for the consequent Premise object if type is 'conditional'
   * @return {Premise} - Premise object which is the consequent in the
   * conditional.
   */
  getConsequent() {
    return this.cons;
  }

  /**
   * Toggle for assumed variable if the premise is of conditional type.
   */
  toggleAnteAssumed() {
    if (!this.anteAssumed) {
      this.anteAssumed = true;
    } else {
      this.anteAssumed = false;
    }
  }
}

export default Premise;
