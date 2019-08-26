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
   */
  constructor(name, premise1=null, premise2=null) {
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
          this.premiseToMatch = premise2;
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
  getResultingPremise() {
    switch (this.name) {
      // MP: check which premise is the conditional and then see if its
      // antecedent is equal to the other premise.
      case 'MP':
        if (this.premise1 && this.premise2) {
          if (this.premise1.getType() === 'conditional' &&
              this.premise1.getAntecedent().equalsPremise(this.premise2)) {
            return this.premise1.getConsequent();
          } else if (this.premise2.getType() === 'conditional' &&
                  this.premise2.getAntecedent().equalsPremise(this.premise1)) {
            return this.premise2.getConsequent();
          } else {
            return 'Modus Ponens cannot be performed on these premises.';
          }
        } else {
          return 'The MP rule needs exactly two premises.';
        }
      case 'DD':
        if (this.premise.equalsPremise(this.premiseToMatch)) {
          return 'solved';
        } else {
          return 'That is not the correct premise for a Direct Derivation.';
        }
    }
  }

  /**
   * Getter for the number of Premises that this Rule will take.
   * @return {int} - The number of allowed Premises for this Rule.
   */
  getAllowedPremises() {
    return this.allowedPremises;
  }

  /**
   * Getter for the name of the current Rule.
   * @return {string} - Name of the current Rule.
   */
  getName() {
    return this.name;
  }
}
export default Rule;
