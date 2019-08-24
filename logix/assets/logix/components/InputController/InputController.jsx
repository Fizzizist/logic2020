import React, {Component} from 'react';

/**
 * React Component for user input into the Derivation Component.
 */
class InputController extends Component {
  /**
   * Constructor for the Component.
   * @param {array} props - Array of state variables from parent Component.
   */
  constructor(props) {
    super(props);
    this.state = {
      premises: this.props.premises,
      conclusion: this.props.conclusion,
      availablePremises: this.props.premises,
      selectedPremises: [],
      buttons: [],
      inputString: '',
      submitToggle: false,
    };
    this.constructButtons = this.constructButtons.bind(this);
    this.selectPremise = this.selectPremise.bind(this);
    this.addMP = this.addMP.bind(this);
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
    if (this.state.conclusion.getType() === 'conditional') {
      const button = <button type='button' onClick={
        this.assumeCD}>Assume CD</button>;
      buttons.push(button);
    }

    // Add Premise buttons for each Premise available to the user.
    this.state.availablePremises.forEach(function(premise, index) {
      const button = <button type="button" onClick={() =>
        this.selectPremise(premise.getID(), premise.getPremiseString())
      }>{premise.getID()}</button>;
      buttons.push(button);
    }.bind(this));

    // If two premises are selected add the MP rule button.
    if (this.state.selectedPremises.length === 2) {
      const button = <button type="button" onClick={this.addMP}>MP</button>;
      buttons.push(button);
    };

    return buttons;
  }

  /**
   * on-click function for Assume CD button that allows the user to assume
   * the antecedent to the conditional conclusion.
   */
  assumeCD() {

  }

  /**
   * On-click function for adding the MP rule to the user input string.
   */
  addMP() {
    this.setState((state) => ({
      inputString: state.inputString.concat(' MP'),
      selectedPremises: [...state.selectedPremises,
        {id: 'MP', premise: 'tempMP'}],
      submitToggle: true,
    }));
  }

  /**
   * When a premise is clicked, it needs to be added to selectedPremises in
   * state.
   * @param {integer} premiseID - The ID of the premise being selected.
   * @param {string} premiseText - String containing the text of the premise.
   */
  selectPremise(premiseID, premiseText) {
    this.setState((state) => ({
      selectedPremises: [...state.selectedPremises,
        {id: premiseID, premise: premiseText}],
      availablePremises: state.availablePremises.filter(
          (premise) => premise.getID() !== premiseID),
      inputString: state.inputString.concat(' ', premiseID),
      submitToggle: false,
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
      </div>
    );
  }
}

export default InputController;
