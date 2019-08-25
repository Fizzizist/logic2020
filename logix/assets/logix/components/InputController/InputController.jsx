import React, {Component} from 'react';
import Rule from '../../classes/Rule';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {submitCommandAction} from '../../actions';

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
      lineNumber: 1,
    };
    this.constructButtons = this.constructButtons.bind(this);
    this.selectPremise = this.selectPremise.bind(this);
    this.assumeCD = this.assumeCD.bind(this);
    this.submitCommand = this.submitCommand.bind(this);
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
      selectedPremises: [...state.selectedPremises,
        state.conclusion.getAntecedent()],
      inputString: state.inputString.concat('Ass CD'),
      submitToggle: true,
    }));
    this.state.conclusion.toggleAnteAssumed();
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
    } else {
      this.setState((state) => ({
        selectedPremises: [newPremise],
        selectedRules: [...state.selectedRules, newRule],
        inputString: state.inputString.concat(' ', rule.getName()),
        submitToggle: true,
      }));
    }
  }

  /**
   * On-click function for the submit button that takes the resulting premise
   * and pushes it into the redux state.
   */
  submitCommand() {
    if (this.state.selectedPremises.length === 1) {
      this.state.selectedPremises[0].setID(this.state.lineNumber.toString());
      this.state.selectedPremises[0].setCommandText(this.state.inputString);
      this.props.submitCommandAction(this.state.selectedPremises[0]);
      this.setState((state) => ({
        inputString: '',
        submitToggle: false,
        availablePremises: [...state.availablePremises,
          state.selectedPremises[0]],
        selectedPremises: [],
        lineNumber: state.lineNumber + 1,
      }));
    }
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
        <button type='button' onClick={
          this.submitCommand}>Submit Command</button>}
        <p>**{this.state.errorMessage}**</p>
      </div>
    );
  }
}

/**
 * Function to map the redux actions to props.
 * @param {dict} dispatch - redux dispatcher
 * @return {dict} - bound action creators.
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    submitCommandAction,
  },
  dispatch);
}

export default connect(null, mapDispatchToProps)(InputController);
