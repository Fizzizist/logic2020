import React, {Component} from 'react';
import {Button, ButtonToolbar, Modal} from 'react-bootstrap';
import Rule from '../../classes/Rule';
import PremiseConstructor from '../../classes/PremiseConstructor';
import Premise from '../../classes/Premise';

// Might not end up using redux at all.
// import {connect} from 'react-redux';
// import {bindActionCreators} from 'redux';
// import {submitCommandAction, showSolved, newShow} from '../../actions';

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
    const mp = new Rule('MP');
    const dd = new Rule('DD');
    const cd = new Rule('CD');
    const mt = new Rule('MT');
    const idRule = new Rule('ID');
    this.updateShowModal = this.updateShowModal.bind(this);
    const premiseConstructor = new PremiseConstructor(this.updateShowModal);
    this.state = {
      premises: this.props.premises,
      conclusion: this.props.conclusion,
      availablePremises: this.props.premises.concat(this.props.linePremises),
      selectedPremises: [],
      linePremises: this.props.linePremises,
      availableRules: [mp, mt, dd, cd, idRule],
      selectedRules: [],
      buttons: [],
      inputString: '',
      submitToggle: false,
      errorMessage: '',
      lineNumber: this.props.lineNumber,
      showShowMenuModal: false,
      premiseConstructor: premiseConstructor,
      showMenuString: '',
      assumed: false,
    };
    this.constructButtons = this.constructButtons.bind(this);
    this.selectPremise = this.selectPremise.bind(this);
    this.assumeCD = this.assumeCD.bind(this);
    this.assumeID = this.assumeID.bind(this);
    this.showCons = this.showCons.bind(this);
    this.submitCommand = this.submitCommand.bind(this);
    this.toggleShowMenu = this.toggleShowMenu.bind(this);
  }

  /**
   * Generates a button in the controller for each premise available to the
   * user.
   * @return {array} - Array of html button tags to be displayed in the
   * component.
   */
  constructButtons() {
    const buttons = [];

    // Add custom Show buttons
    const showCustomButton =
    <Button onClick={this.toggleShowMenu}>Show Custom</Button>;
    buttons.push(showCustomButton);
    if (this.state.conclusion.type === 'conditional') {
      const showConsButton =
      <Button onClick={this.showCons}>Show Cons</Button>;
      buttons.push(showConsButton);
    }

    // Add buttons for Assume statements.
    if (this.state.conclusion.type === 'conditional' &&
        !this.state.assumed) {
      const button = <Button onClick={
        this.assumeCD}>Assume CD</Button>;
      buttons.push(button);
    }
    if (!this.state.assumed) {
      const button = <Button onClick={this.assumeID}>Assume ID</Button>;
      buttons.push(button);
    }

    // Add Premise buttons for each Premise available to the user.
    this.state.availablePremises.forEach(function(premise, _) {
      const button = <Button onClick={() => this.selectPremise(premise)
      }>{premise.id}</Button>;
      buttons.push(button);
    }.bind(this));

    // Generate buttons for Rules
    this.state.availableRules.forEach(function(rule, _) {
      if (this.state.selectedPremises.length === rule.allowedPremises) {
        const button = <Button onClick={() =>this.selectRule(rule)
        }>{rule.name}</Button>;
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
        state.conclusion.antecedent],
      inputString: state.inputString.concat('Ass CD'),
      submitToggle: true,
      assumed: true,
    }));
  }

  /**
   * on-click function for Assume ID button that allows the user to assume
   * the negation of the conclusion in order to generate a contradiction.
   */
  assumeID() {
    const negatedConclusion = new Premise({
      type: 'not',
      premise1: this.state.conclusion,
    });
    this.setState((state) => ({
      selectedPremises: [...state.selectedPremises, negatedConclusion],
      inputString: state.inputString.concat('Ass ID'),
      submitToggle: true,
      assumed: true,
    }));
  }

  /**
   * On-Click function for Show Cons that allows the user to show the consequent
   * of the conditional conclusion in one click.
   */
  showCons() {
    this.props.newShow(this.state.conclusion.consequent);
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
          (p) => p.id !== premise.id),
      inputString: state.inputString.concat(' ', premise.id),
    }));
  }

  /**
   * On-click function for selecting a rule.
   * @param {Rule} rule - Rule object being selected.
   */
  selectRule(rule) {
    let newRule;
    if (rule.allowedPremises === 2) {
      switch (rule.name) {
        case 'ID':
          newRule = new Rule(
              rule.name,
              this.state.selectedPremises[0],
              this.state.selectedPremises[1],
              this.state.conclusion,
          );
          break;
        default:
          newRule = new Rule(
              rule.name,
              this.state.selectedPremises[0],
              this.state.selectedPremises[1]
          );
      }
    } else if (rule.allowedPremises === 1) {
      switch (rule.name) {
        case 'DD':
          newRule = new Rule(
              rule.name,
              this.state.selectedPremises[0],
              this.state.conclusion,
          );
          break;
        case 'CD':
          newRule = new Rule(
              rule.name,
              this.state.selectedPremises[0],
              this.state.conclusion.consequent,
              this.state.conclusion
          );
          break;
        default:
          newRule = new Rule(
              rule.name,
              this.state.selectedPremises[0]
          );
          break;
      }
    }

    const newPremise = newRule.resultingPremise;
    if (typeof newPremise === 'string') {
      this.setState((state) => ({
        availablePremises: this.props.premises.concat(
            state.linePremises),
        selectedPremises: [],
        inputString: '',
        errorMessage: newPremise,
      }));
    } else {
      const newDeepCopy = Object.assign(Object.create( Object.getPrototypeOf(
          newPremise)), newPremise);
      this.setState((state) => ({
        selectedPremises: [newDeepCopy],
        selectedRules: [...state.selectedRules, newRule],
        inputString: state.inputString.concat(' ', rule.name),
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
      this.state.selectedPremises[0].id = this.state.lineNumber.toString();
      this.state.selectedPremises[0].commandText = this.state.inputString;
      this.props.submitCommand(this.state.selectedPremises[0]);
      this.setState((state) => ({
        inputString: '',
        submitToggle: false,
        availablePremises: this.props.premises.concat(
            state.linePremises).concat(
            state.selectedPremises),
        selectedPremises: [],
        linePremises: [...state.linePremises, state.selectedPremises[0]],
        lineNumber: state.lineNumber + 1,
      }));
    }
  }

  /**
   * Toggle for Show Modal that pops up to make a custom Show.
   */
  toggleShowMenu() {
    if (this.state.showShowMenuModal) {
      this.setState((state) => ({
        showShowMenuModal: false,
        showMenuString: '',
      }));
      this.state.premiseConstructor.premiseString = '';
    } else {
      this.setState((state) => ({
        showShowMenuModal: true,
      }));
    }
  }

  /**
   * Callback function passed into PremiseConstructor in order to update
   * this component's state when a button is pressed in the modal.
   */
  updateShowModal() {
    this.setState((state) => ({
      showMenuString: this.state.premiseConstructor.premiseString,
    }));
  }

  /**
   * Function to get the custom premise from the PremiseConstructor and feed
   * it to the new show.
   * @return {Premise} - Premise from PremiseConstructor.
   */
  showCustomPremise() {
    const newPremise = this.state.premiseConstructor.resultingPremise;
    this.toggleShowMenu();
    return newPremise;
  }

  /**
   * The final HTML render from the Component.
   * @return {string} HTML containing all of the Component's elements.
   */
  render() {
    const buttons = this.constructButtons();
    return (
      <div>
        <ButtonToolbar>
          {buttons}
        </ButtonToolbar>

        <Modal size='sm' show={this.state.showShowMenuModal} onHide={
          this.toggleShowMenu
        }>
          <Modal.Header>
            <Modal.Title>{this.state.showMenuString}
              <Button type="submit" onClick={() =>
                this.props.newShow(this.showCustomPremise())}>Submit</Button>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ButtonToolbar>
              {this.state.premiseConstructor.buttons}
            </ButtonToolbar>
          </Modal.Body>
        </Modal>

        <p>Command: {this.state.inputString}</p>
        {this.state.submitToggle &&
        <Button type='button' onClick={
          this.submitCommand}>Submit Command</Button>}
        <p>**{this.state.errorMessage}**</p>
      </div>
    );
  }
}

// Might not end up using Redux.

// /**
//  * Function to map the redux actions to props.
//  * @param {dict} dispatch - redux dispatcher
//  * @return {dict} - bound action creators.
//  */
// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({
//     submitCommandAction,
//     showSolved,
//     newShow,
//   },
//   dispatch);
// }

// export default connect(null, mapDispatchToProps)(InputController);
export default InputController;
