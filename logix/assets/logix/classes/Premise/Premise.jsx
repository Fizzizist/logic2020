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
    this.commandText = '';
    this.anteAssumed = false;
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

  // ------------------------Getters--------------------------------------------

  /**
   * Getter for the string of the premise.
   * @return {string} - String representing the premise.
   */
  get premiseString() {
    let prem1Str;
    let prem2Str;
    // Bracketed switch. Below switch doesn't run if these are true.
    switch (this.type) {
      case 'atomic':
        return this.symbol;
      case 'not':
        if (this.premise.type !== 'atomic' && this.premise.type !== 'not') {
          return `~(${this.premise.premiseString})`;
        } else {
          return `~${this.premise.premiseString}`;
        }
      case 'conditional':
        if (this.ante.type !== 'atomic' && this.ante.type !== 'not') {
          prem1Str = `(${this.ante.premiseString})`;
        } else {
          prem1Str = this.ante.premiseString;
        }
        if (this.cons.type !== 'atomic' && this.cons.type !== 'not') {
          prem2Str = `(${this.cons.premiseString})`;
        } else {
          prem2Str = this.cons.premiseString;
        }
        break;
      case 'biconditional':
      case 'or':
      case 'and':
        if (this.premise1.type !== 'atomic' && this.premise1.type !== 'not') {
          prem1Str = `(${this.premise1.premiseString})`;
        } else {
          prem1Str = this.premise1.premiseString;
        }
        if (this.premise2.type !== 'atomic' && this.premise2.type !== 'not') {
          prem2Str = `(${this.premise2.premiseString})`;
        } else {
          prem2Str = this.premise2.premiseString;
        }
        break;
    }
    // Print with symbol.
    switch (this.type) {
      case 'conditional':
        return `${prem1Str} → ${prem2Str}`;
      case 'biconditional':
        return `${prem1Str} ↔ ${prem2Str}`;
      case 'and':
        return `${prem1Str} ^ ${prem2Str}`;
      case 'or':
        return `${prem1Str} v ${prem2Str}`;
    }
  }

  /**
   * Getter for the type of the Premise.
   * @return {string} - String representing the type of the premise.
   */
  get type() {
    return this._type;
  }

  /**
   * Getter for the short identifier of the premise.
   * @return {string} - String representing the identifier for the premise.
   */
  get id() {
    return this._id;
  }

  /**
   * Getter for assumed variable if the premise is of conditional type.
   * @return {bool} - Boolean representing the state of the antiAssumed variable
   */
  get anteAssumed() {
    return this._anteAssumed;
  }

  /**
   * Getter for the antecedent Premise object if type is 'conditional'
   * @return {Premise} - Premise object which is the antecedent in the
   * conditional.
   */
  get antecedent() {
    return this.ante;
  }

  /**
   * Getter for the consequent Premise object if type is 'conditional'
   * @return {Premise} - Premise object which is the consequent in the
   * conditional.
   */
  get consequent() {
    return this.cons;
  }

  /**
   * Getter for the command text that genrated this Premise, if it was generated
   * by a command.
   * @return {string} - command text.
   */
  get commandText() {
    return this._commandText;
  }

  // ---------------------------------Setters-----------------------------------

  /**
   * Setter for id allowing the ID to be changed.
   * @param {string} value - The new ID for the Premise.
   */
  set id(value) {
    this._id = value;
  }

  /**
   * Set the command text for when the Premise is generated by a command and
   * sent to the Show window.
   * @param {string} cText - The command string.
   */
  set commandText(cText) {
    this._commandText = cText;
  }

  /**
   * Setter for the type property
   * @param {string} value - representing the type of Premise.
   */
  set type(value) {
    this._type = value;
  }

  /**
   * Setter for the anteAssumed property
   * @param {boolean} value - representing whether the antecedent has been
   * assumed for conditional premise.
   */
  set anteAssumed(value) {
    this._anteAssumed = value;
  }

  // -------------------------------Other Functions-----------------------------

  /**
   * Fuction to compare two premises for equality.
   * @param {Premise} premise - The premise being compared to this premise.
   * @return {bool} - True or False for whether they are equal or not.
   */
  equalsPremise(premise) {
    if (this.type === premise.type) {
      switch (this.type) {
        case 'atomic':
          if (this.symbol === premise.symbol) return true;
          return false;
        case 'conditional':
          if (this.ante.equalsPremise(premise.ante) &&
              this.cons.equalsPremise(premise.cons)) return true;
          return false;
        case 'biconditional':
        case 'and':
        case 'or':
          if ((this.premise1.equalsPremise(premise.premise1) &&
              this.premise2.equalsPremise(premise.premise2)) ||
              (this.premise2.equalsPremise(premise.premise1) &&
              this.premise1.equalsPremise(premise.premise2))) return true;
          return false;
        case 'not':
          if (this.premise.equalsPremise(premise.premise)) return true;
          return false;
        default:
          return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Validator for Premise integrity.
   * @return {boolean} - indicating validation of premise.
   */
  isValid() {
    const atomicsArray =
    ['P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    switch (this.type) {
      case 'atomic':
        if (atomicsArray.includes(this.symbol)) return true;
        else return false;
      case 'conditional':
        if (typeof this.ante === 'string' || typeof this.cons === 'string') {
          return false;
        }
        if (this.ante.isValid() && this.cons.isValid()) return true;
        else return false;
      case 'and':
      case 'or':
      case 'biconditional':
        if (typeof this.premise1 === 'string' ||
            typeof this.premise2 === 'string') {
          return false;
        }
        if (this.premise1.isValid() && this.premise2.isValid()) return true;
        else return false;
      case 'not':
        if (typeof this.premise === 'string') return false;
        if (this.premise.isValid()) return true;
        else return false;
      default:
        return false;
    }
  }
}

export default Premise;
