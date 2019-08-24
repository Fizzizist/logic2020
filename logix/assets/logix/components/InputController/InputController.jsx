import React, {Component} from 'react';
import Rule from '../../classes/Rule';

/**
 * React Component for user input into the Derivation Component.
 */
class InputController extends Component {
  /**
   * Constructor for the Component.
   * @param {array} props - Array of state variables from parent Component.
   */
  constructor(props) {
    const mp = new Rule('MP');
    super(props);
    this.state = {
      premises: this.props.premises,
      conclusion: this.props.conclusion,
      availablePremises: this.props.premises,
      selectedPremises: [],
      availableRules: [mp],
      selectedRules: [],
      buttons: [],
      inputString: '',
      submitToggle: false,
      errorMessage: '',
    };
    this.constructButtons = this.constructButtons.bind(this);
    this.selectPremise = this.selectPremise.bind(this);
    this.addMP = this.addMP.bind(this);
    this.assumeCD = this.assumeCD.bind(this);
  }

  /**
   * Generates a button in the controller for each premise available to the
   * user.
   * @return {array} - Array of html button tags to be displayed in the
   * component.
   */
  constructButtons() {
    const buttons = [];
    // Add buttons for Assume statements.
    if (this.state.conclusion.getType() === 'conditional' &&
        !this.state.conclusion.getAnteAssumed()) {
      const button = <button type='button' onClick={
        this.assumeCD}>Assume CD</button>;
      buttons.push(button);
    }

    // Add Premise buttons for each Premise available to the user.
    this.state.availablePremises.forEach(function(premise, _) {
      const button = <button type="button" onClick={() =>
        this.selectPremise(premise)
      }>{premise.getID()}</button>;
      buttons.push(button);
    }.bind(this));

    // Generate buttons for Rules
    this.state.availableRules.forEach(function(rule, _) {
      if (this.state.selectedPremises.length === rule.getAllowedPremises()) {
        const button = <button type="button" onClick={() =>
          this.selectRule(rule)
        }>{rule.getName()}</button>;
        buttons.push(button);
      }
    }.bind(this));
    return buttons;
  }

  /**
   * on-click function for Assume CD button that allows the user to assume
   * the antecedent to the conditional conclusion.
   */
  assumeCD() {
    this.setState((state) => ({
      inputString: state.inputString.concat('Ass CD'),
      submitToggle: true,
    }));
    this.state.conclusion.toggleAnteAssumed();
  }

  /**
   * On-click function for adding the MP rule to the user input string.
   */
  addMP() {
    this.setState((state) => ({
      // TODO: add functionality to this function.
      inputString: state.inputString.concat(' MP'),
    }));
  }

  /**
   * When a premise is clicked, it needs to be added to selectedPremises in
   * state.
   * @param {Premise} premise - The ID of the premise being selected.
   */
  selectPremise(premise) {
    this.setState((state) => ({
      selectedPremises: [...state.selectedPremises, premise],
      availablePremises: state.availablePremises.filter(
          (p) => p.getID() !== premise.getID()),
      inputString: state.inputString.concat(' ', premise.getID()),
    }));
  }

  /**
   * On-click function for selecting a rule.
   * @param {Rule} rule - Rule object being selected.
   */
  selectRule(rule) {
    let newRule;
    if (rule.getAllowedPremises() === 2) {
      newRule = new Rule(
          rule.getName(),
          this.state.selectedPremises[0],
          this.state.selectedPremises[1]
      );
    }
    const newPremise = newRule.getResultingPremise();
    if (typeof newPremise === 'string') {
      this.setState((state) => ({
        errorMessage: newPremise,
      }));
    }
    this.setState((state) => ({
      selectedPremises: [newPremise],
      selectedRules: [...state.selectedRules, newRule],
      inputString: state.inputString.concat(' ', rule.getName()),
      submitToggle: true,
    }));
  }

  /**
   * The final HTML render from the Component.
   * @return {string} HTML containing all of the Component's elements.
   */
  render() {
    const buttons = this.constructButtons();
    return (
      <div>
        {buttons}
        <p>Command: {this.state.inputString}</p>
        {this.state.submitToggle &&
        <button type='button' onClick=''>Submit Command</button>}
        <p>**{this.state.errorMessage}**</p>
      </div>
    );
  }
}

export default InputController;
