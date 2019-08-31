/**
 * Generalized Rule class to represent all logical rules in the game for example
 * MP, MT, etc.
 */
class Rule {
  /**
   * constructor for Rule class.
   * @param {string} name - The name of the rule e.g. 'MP', 'MT'
   * @param {Premise} premise1 - The first premise analyzed by the rules.
   * @param {Premise} premise2 - The second premise if it exists.
   * @param {Premise} premise3 - third premise to hold the conclusion in the
   * case of a consitional derivation.
   */
  constructor(name, premise1=null, premise2=null, premise3=null) {
    this.name = name;
    switch (name) {
      case 'MP':
        if (premise1 && premise2) {
          this.premise1 = premise1;
          this.premise2 = premise2;
        }
        this.allowedPremises = 2;
        break;
      case 'DD':
        if (premise1) {
          this.premise = premise1;
          this.conclusion = premise2;
        }
        this.allowedPremises = 1;
        break;
      case 'CD':
        if (premise1) {
          this.premise = premise1;
          this.consequent = premise2;
          this.conclusion = premise3;
        }
        this.allowedPremises = 1;
        break;
    }
  }

  /**
   * Getter for the resulting premise of a rule.
   * Premises can be entered into the rule either way.
   * @return {Premise | string} - Premise object which is the result of the
   * rule or an error string explaining why it didn't work.
   */
  get resultingPremise() {
    switch (this.name) {
      // MP: check which premise is the conditional and then see if its
      // antecedent is equal to the other premise.
      case 'MP':
        if (this.premise1 && this.premise2) {
          if (this.premise1.type === 'conditional' &&
              this.premise1.antecedent.equalsPremise(this.premise2)) {
            return this.premise1.consequent;
          } else if (this.premise2.type === 'conditional' &&
                  this.premise2.antecedent.equalsPremise(this.premise1)) {
            return this.premise2.consequent;
          } else {
            return 'Modus Ponens cannot be performed on these premises.';
          }
        } else {
          return 'The MP rule needs exactly two premises.';
        }
      case 'DD':
        if (this.premise.equalsPremise(this.conclusion)) {
          return this.premise;
        } else {
          return 'That is not the correct premise for a Direct Derivation.';
        }
      case 'CD':
        if (this.premise.equalsPremise(this.consequent)) {
          return this.conclusion;
        } else {
          return 'That is not the correct premise for a Conditional ' +
            'Derivation.';
        }
    }
  }

  // ---------------------------Getters-----------------------------------------

  /**
   * Getter for the number of Premises that this Rule will take.
   * @return {int} - The number of allowed Premises for this Rule.
   */
  get allowedPremises() {
    return this._allowedPremises;
  }

  /**
   * Getter for the name of the current Rule.
   * @return {string} - Name of the current Rule.
   */
  get name() {
    return this._name;
  }

  // ---------------------------Setters-----------------------------------------

  /**
   * Setter for the name property.
   * @param {string} value - representing the name of the Rule.
   */
  set name(value) {
    this._name = value;
  }

  /**
   * Setter for the allowedPremises property.
   * @param {int} value - representing number of allowed Premises for the Rule.
   */
  set allowedPremises(value) {
    this._allowedPremises = value;
  }
}

export default Rule;
